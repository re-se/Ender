//@flow

import fs from 'fs';
import path from 'path';
import parser from './ender.js';
import instMap from './instMap.js';

class Ender {
  insts: Inst[];
  pc: number;

  constructor(scriptPath: string) {
    this._loadScript(scriptPath);
    this.pc = 0;
  }

  /**
   * スクリプトファイルを読み込む
   * @param {string} scriptPath スクリプトファイルのフルパス
   */
  _loadScript(scriptPath: string) {
    let script = fs.readFileSync(scriptPath).toString();
    this.insts = parser.parse(script);
  }

  /**
   * 命令列を実行する
   * @return {[type]} [description]
   */
  exec() {
    let inst = this.insts[this.pc];
    // 命令実行
    instMap[inst.type](this, inst);

    this.pc++;
  }
}

export default Ender;
