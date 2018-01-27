//@flow

/**
 * 命令の抽象クラス。命令実行に必要な情報などを持つ。viewの状態に直接働きかける。
 */
class Inst {
  /**
   * [抽象メソッド]命令名を取得
   * @return {string}
   */
  getName(): string {
    console.warn('unimplemented method! ${this.constructor.name}')
    return ''
  }

  /**
   * 命令実行
   * @return {void}
   */
  exec(): void {
    console.warn('unimplemented method! ${this.constructor.name}')
  }
}
