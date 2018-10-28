//@flow

import fs from 'fs'
import path from 'path'
import { set, get, has, last, findLastIndex } from 'lodash'
import parser from './parser.js'
import instMap from './instMap.js'
import * as funcMap from './funcMap.js'
import { GeneratorFunction, isDevelop } from '../util/util'
import { resetState, finishAnimation } from '../actions/actions'
import store from './store'
import init from '../util/css-import'

class Ender {
  instsStack: Inst[][]
  pcStack: number[]
  scriptPath: string
  nameMapStack: { [string]: any }[]
  mainLoop: Iterator<any>
  isFinished = false
  _yieldValue: any

  get pc(): number {
    return last(this.pcStack)
  }
  set pc(value: number): number {
    return (this.pcStack[this.pcStack.length - 1] = value)
  }

  get insts(): Inst[] {
    return last(this.instsStack)
  }
  set insts(value: Inst[]) {
    return (this.instsStack[this.instsStack.length - 1] = value)
  }

  get nameMap(): { [string]: any } {
    return last(this.nameMapStack)
  }
  set nameMap(map: { [string]: any }) {
    return (this.nameMapStack[this.nameMapStack.length - 1] = map)
  }

  /**
   * 初期化
   * @param  {Config} config
   * @return {void}
   */
  init(config: Config) {
    config.auto = false

    let textPath = get(config, 'text.path', '')
    this.scriptPath = path.join(config.basePath, textPath, config.main)

    this.instsStack = [[]]
    this._loadScript()
    this.pcStack = [0]
    this.mainLoop = this._mainLoop()
    this.nameMapStack = [{}]
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
      if (this.pc >= this.insts.length && this.instsStack.length > 1) {
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
          return expr
        default:
          return expr
      }
    } else {
      return expr
    }
  }

  /**
   * 変数を取得
   * @param  {string} varPath 変数のパス
   * @param  {any} defaultValue デフォルト値
   * @return {any}
   */
  getVar(varPath: string, defaultValue: any = null) {
    let variable = get(
      this.nameMapStack[
        findLastIndex(this.nameMapStack, nameMap =>
          has(nameMap, getReceiver(varPath))
        )
      ],
      varPath
    )

    if (variable === undefined && defaultValue == null) {
      console.warn(`undefined variable: ${varPath}`)
    }

    return variable || defaultValue
  }

  /**
   * スクリプトで使う変数を設定する
   * @param {string} varPath 変数のパス
   * @param {any} value
   */
  setVar(varPath: string, value: any) {
    const v = this.eval(value)
    const nameMap = this.nameMapStack[
      findLastIndex(this.nameMapStack, nameMap =>
        has(nameMap, getReceiver(varPath))
      )
    ]

    if (nameMap) {
      // スコープを遡って代入
      set(nameMap, varPath, v)
    } else {
      // 変数が未定義なら現在のスコープの変数として代入
      this.declVar(varPath, value)
    }

    return v
  }

  declVar(path: string, value: any) {
    set(this.nameMap, path, this.eval(value))
  }

  nestScope() {
    this.nameMapStack.push({})
  }

  unnestScope() {
    this.nameMapStack.pop()
  }

  callInsts(insts: Inst[]) {
    // mainloop の pc++ 前に呼ばれるため、0 - 1 の -1 としている
    this.pcStack.push(-1)
    this.instsStack.push(insts)
    this.nestScope()
  }

  backInsts() {
    this.pcStack.pop()
    this.instsStack.pop()
    this.unnestScope()
  }
}

export default new Ender()

function getReceiver(varPath: string): string {
  return varPath.split(/ |\.|\[/)[0]
}
