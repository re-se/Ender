//@flow
import selectorParser from './SelectorParser.js'

export default class StyleUtil {
  /**
   * セレクタを解釈して Selector の配列にして返す
   * @param {string} selector
   * @type {Selector[]}
   */
  static parse(selector: string): Selector[] {
    if (selector === '') return []
    let selectorTree = selectorParser.parse(selector)
    return selectorTree instanceof Array ? selectorTree : [selectorTree]
  }

  /**
   * 解釈したセレクタオブジェクトを実際に使用するセレクタ文字列に変換
   * @param  {Selector[]} selectorTree
   * @return {string}
   */
  static toString(selectorTree: Selector[]): string {
    let out = ''

    for (const selector of selectorTree) {
      if (selector.type === 'classSelector') {
        out += '.' + selector.value + ','
      } else if (selector.type === 'idSelector') {
        out += '#' + selector.value + ','
      }
    }

    return out.length > 0 ? out.slice(0, -1) : ''
  }
}
