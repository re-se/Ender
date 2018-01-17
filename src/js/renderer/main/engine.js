//@flow

import fs from 'fs'
import path from 'path'
import { set, get, has } from 'lodash'
import parser from './parser.js'
import instMap from './instMap.js'
import { GeneratorFunction } from '../util/util'
import { remote } from 'electron'
import { resetState, finishAnimation } from '../actions/actions'
import store from './store'
import init from '../util/css-import'

class Ender {
  insts: Inst[]
  pc: number
  scriptPath: string
  nameMap: {}

  /**
   * 初期化
   * @param  {Config} config
   * @return {void}
   */
  init(config) {
    init()
    let textPath = get(config, 'text.path') || ''
    this.scriptPath = path.join(config.basePath, textPath, config.main)

    this._loadScript()
    this.pc = 0
    this.mainLoop = this._mainLoop()
    this.nameMap = {}
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
  lookahead(n = 1) {
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
      if (!animation[key].isFinished) {
        animation[key].onExec()
        isInterrupted = true
      }
    }
    if (isInterrupted) {
      store.dispatch(finishAnimation())
    } else {
      this.mainLoop.next()
    }
  }

  *_mainLoop() {
    while (this.pc < this.insts.length) {
      const inst = this.insts[this.pc]
      // 命令実行
      if (instMap[inst.type] instanceof GeneratorFunction) {
        yield* instMap[inst.type](inst)
      } else {
        instMap[inst.type](inst)
      }

      this.pc += 1

      if (remote.process.env['NODE_ENV'] === 'development') {
        if (this.pc >= this.insts.length) {
          yield
          store.dispatch(resetState())
          this.pc = 0
        }
      }
    }
  }

  eval(expr) {
    if(expr instanceof Object) {
      switch (expr.type) {
        case "var": return this.getVar(expr.name)
        case "func": return instMap[expr.type](expr)
        default: return expr
      }
    } else {
      return expr
    }
  }

  /**
   * 変数を取得
   * @param  {string} path 変数のパス
   * @return {any}
   */
  getVar(path) {
    if(!has(this.nameMap, path)) {
      console.warn(`undefined variable: ${path}`)
    }
    return get(this.nameMap, path)
  }

  /**
   * スクリプトで使う変数を設定する
   * @param {string} path 変数のパス
   * @param {any} value
   */
  setVar(path, value) {
    set(this.nameMap, path, this.eval(value))
  }
}

export default new Ender()
