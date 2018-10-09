//@flow

import fs from 'fs'
import path from 'path'
import { set, get, has } from 'lodash'
import parser from './parser.js'
import instMap from './instMap.js'
import * as funcMap from './funcMap.js'
import { GeneratorFunction, isDevelop } from '../util/util'
import { resetState, finishAnimation } from '../actions/actions'
import store from './store'
import init from '../util/css-import'
import Stack from '../util/Stack'
import Lambda from '../util/Lambda'

class Ender {
  _insts: Stack<Inst[]>
  _pc: Stack<number>
  scriptPath: string
  nameMap: Stack<{ [string]: any }>
  mainLoop: Iterator<any>
  isFinished = false
  _yieldValue: any

  get pc(): number {
    return this._pc.top()
  }
  set pc(value: number): number {
    return this._pc.set(value)
  }

  get insts(): Inst[] {
    return this._insts.top()
  }
  set insts(value: Inst[]) {
    return this._insts.set(value)
  }

  /**
   * 初期化
   * @param  {Config} config
   * @return {void}
   */
  init(config: Config) {
    let textPath = get(config, 'text.path', '')
    this.scriptPath = path.join(config.basePath, textPath, config.main)

    this._insts = new Stack([])
    this._loadScript()
    this._pc = new Stack(0)
    this.mainLoop = this._mainLoop()
    this.nameMap = new Stack({})
    this.isFinished = false
    this.setVar('config', config)
    init()
  }

  /**
   * スクリプトファイルを読み込む
   */
  _loadScript() {
    const script = fs.readFileSync(this.scriptPath).toString()
    this.insts = (parser.parse(script): Inst[])
  }

  /**
   * 命令列の先読み
   */
  lookahead(n: number = 1): Inst {
    return this.insts[this.pc + n]
  }

  /**
   * 命令列を実行する
   * @return {[type]} [description]
   */
  exec() {
    const animation = store.getState().animation
    let isInterrupted = false
    for (const key in animation) {
      if (animation[key].isStarted && !animation[key].isFinished) {
        animation[key].onExec()
        isInterrupted = true
      }
    }
    store.dispatch(finishAnimation())
    if (!isInterrupted) {
      let { value, done } = this.mainLoop.next()
      this._yieldValue = value
      this.isFinished = done
    }
  }

  *_mainLoop(): GeneratorFunction {
    while (this.pc < this.insts.length) {
      if (isDevelop()) {
        console.log(this.pc, this.insts[this.pc])
      }
      const inst = this.insts[this.pc]
      // 命令実行
      if (instMap[inst.type] instanceof GeneratorFunction) {
        yield* instMap[inst.type](inst)
      } else {
        instMap[inst.type](inst)
      }

      this.pc += 1

      // 命令列の最後に到達 && 戻り先の命令列がある場合
      if (this.pc >= this.insts.length && this._insts.size > 1) {
        this.backInsts()
        // 命令列呼び出しから pc が増えていないので、ここで増やす
        this.pc += 1
      }

      if (isDevelop()) {
        if (this.pc >= this.insts.length) {
          yield
          store.dispatch(resetState())
          this.pc = 0
        }
      }
    }
  }

  eval(expr: Object | string | number) {
    if (expr instanceof Object) {
      switch (expr.type) {
        case 'var':
          return this.eval(this.getVar(expr.name))
        case 'func':
          return funcMap.exec(expr)
        case 'lambda':
          return new Lambda(expr)
        default:
          return expr
      }
    } else {
      return expr
    }
  }

  /**
   * 変数を取得
   * @param  {string} path 変数のパス
   * @param  {any} defaultValue デフォルト値
   * @return {any}
   */
  getVar(path: string, defaultValue: any = null) {
    let variable = undefined
    this.nameMap.forEach(nameMap => {
      if (has(nameMap, path) && variable === undefined) {
        variable = get(nameMap, path)
      }
    })

    if (variable === undefined && defaultValue == null) {
      console.warn(`undefined variable: ${path}`)
    }

    return variable || defaultValue
  }

  /**
   * スクリプトで使う変数を設定する
   * @param {string} path 変数のパス
   * @param {any} value
   */
  setVar(path: string, value: any) {
    const v = this.eval(value)
    let isSet = false

    // スコープを遡って代入
    this.nameMap.forEach(nameMap => {
      if (has(nameMap, path) && !isSet) {
        set(nameMap, path, v)
        isSet = true
      }
    })

    // 変数が未定義なら現在のスコープの変数として代入
    if (!isSet) {
      this.declVar(path, value)
    }

    return v
  }

  declVar(path: string, value: any) {
    set(this.nameMap.top(), path, this.eval(value))
  }

  nestScoop() {
    this.nameMap.push({})
  }

  unnestScoop() {
    this.nameMap.pop()
  }

  callInsts(insts: Inst[]) {
    // mainloop の pc++ 前に呼ばれるため、0 - 1 の -1 としている
    this._pc.push(-1)
    this._insts.push(insts)
    this.nestScoop()
  }

  backInsts() {
    this._pc.pop()
    this._insts.pop()
    this.unnestScoop()
  }

  getContext() {
    return {
      scriptPath: this.scriptPath,
      pc: this._pc,
      insts: this._insts,
      nameMap: this.nameMap,
    }
  }

  loadSaveData(saveData) {
    this.init(this.getVar('config'))
    this.scriptPath = saveData.engine.scriptPath
    this._pc = saveData.engine.pc
    this._insts = saveData.engine.insts
    this.nameMap = saveData.engine.nameMap

    store
  }
}

export default new Ender()
