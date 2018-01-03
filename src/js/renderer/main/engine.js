//@flow

import fs from 'fs'
import path from 'path'
import { get } from 'lodash'
import parser from './parser.js'
import instMap from './instMap.js'

class Ender {
  insts: Inst[]
  pc: number
  store

  constructor(config) {
    let textPath = get(config, 'text.path') || ''
    let scriptPath = path.join(config.basePath, textPath, config.main)

    this._loadScript(scriptPath)
    this.pc = 0
    this.mainLoop = this._mainLoop()
  }

  /**
   * スクリプトファイルを読み込む
   * @param {string} scriptPath スクリプトファイルのフルパス
   */
  _loadScript(scriptPath: string) {
    const script = fs.readFileSync(scriptPath).toString()
    this.insts = parser.parse(script)
  }

  /**
   * 命令列を実行する
   * @return {[type]} [description]
   */
  exec() {
    this.mainLoop.next()
  }

  *_mainLoop() {
    while(this.pc < this.insts.length) {
      const inst = this.insts[this.pc]
      // 命令実行
      instMap[inst.type](inst)
      this.pc += 1
    }
  }
}

export default Ender
