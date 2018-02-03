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

class Ender {
  insts: Inst[]
  pc: number
  scriptPath: string
  nameMap: {}
  mainLoop: Iterator<any>
  isFinished = false
  _yieldValue: any

  /**
   * 初期化
   * @param  {Config} config
   * @return {void}
   */
  init(config: Config) {
    let textPath = get(config, 'text.path', '')
    this.scriptPath = path.join(config.basePath, textPath, config.main)

    this._loadScript()
    this.pc = 0
    this.mainLoop = this._mainLoop()
    this.nameMap = {}
    this.isFinished = false
    this.setVar('config', config)
    init()
  }

  /**
   * スクリプトファイルを読み込む
   */
  _loadScript() {
    const script = fs.readFileSync(this.scriptPath).toString()
    this.insts = parser.parse(script)
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
        console.log(this.insts[this.pc], this.pc)
      }
      const inst = this.insts[this.pc]
      // 命令実行
      if (instMap[inst.type] instanceof GeneratorFunction) {
        yield* instMap[inst.type](inst)
      } else {
        instMap[inst.type](inst)
      }

      this.pc += 1

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
    if (!has(this.nameMap, path) && defaultValue == null) {
      console.warn(`undefined variable: ${path}`)
    }
    return get(this.nameMap, path, defaultValue)
  }

  /**
   * スクリプトで使う変数を設定する
   * @param {string} path 変数のパス
   * @param {any} value
   */
  setVar(path: string, value: any) {
    const v = this.eval(value)
    set(this.nameMap, path, v)
    return v
  }
}

export default new Ender()
