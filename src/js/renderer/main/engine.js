//@flow

import fs from 'fs'
import path from 'path'
import { get } from 'lodash'
import parser from './parser.js'
import instMap from './instMap.js'
import { GeneratorFunction } from '../util/util'
import { remote } from 'electron'
import { resetState, finishAnimation } from '../actions/actions'
import store from './store'

class Ender {
  insts: Inst[]
  pc: number
  scriptPath: string
  nameMap: Map

  /**
   * 初期化
   * @param  {Config} config
   * @return {void}
   */
  init(config) {
    let textPath = get(config, 'text.path') || ''
    this.scriptPath = path.join(config.basePath, textPath, config.main)

    this._loadScript()
    this.pc = 0
    this.mainLoop = this._mainLoop()
    this.nameMap = new Map()
  }

  /**
   * スクリプトファイルを読み込む
   */
  _loadScript() {
    const script = fs.readFileSync(this.scriptPath).toString()
    this.insts = parser.parse(script)
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
        animation[key].finish()
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
          store.dispatch(resetState())
          this.pc = 0
        }
      }
    }
  }

  eval(expr) {
    if(expr instanceof object) {
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
   * グローバル変数を取得
   * @param  {string} name 変数名
   * @return {any}
   */
   getVar(name) {
    return this.nameMap.get(name)
  }

  /**
   * スクリプトで使変数を設定する
   * @param {string} name 変数名
   * @param {any} value
   * @return {any}
   */
  setVar(name, value) {
    return this.nameMap.set(name, value)
  }
}

export default new Ender()