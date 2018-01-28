//@flow
import selectorParser from './SelectorParser.js'

export default class StyleUtil {
  /**
   * セレクタを解釈して Selector の配列にして返す
   * @param {string} selector
   * @type {Selector[]}
   */
  static parse(selector: string): Selector[] {
    let selectorTree = selectorParser.parse(selector)
    return selectorTree instanceof Array ? selectorTree : [selectorTree]
  }
}
