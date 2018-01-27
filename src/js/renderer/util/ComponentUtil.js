//@flow
import type { FuncInst } from '../main/instMap'
import componentList from '../config/componentList'

export default class ComponentUtil {
  /**
   * コンポーネントの引数をオブジェクトに変換して取得
   * @param  {FuncInst} component
   * @return {any}
   */
  static getProps(component: FuncInst): any {
    return component.args
      ? componentList[component.name].getProps(component.args)
      : {}
  }

  /**
   * 指定のコンポーネントがセレクタの対象になるか判定
   * 現状並列のクラスのみに対応
   * @param  {FuncInst} component
   * @param  {string[]} selectorClassNames
   * @return {boolean}
   */
  static matchSelector(
    component: FuncInst,
    selectorClassNames: string[]
  ): boolean {
    let classNames = ComponentUtil.getProps(component).classNames || []

    for (const selectorClassName of selectorClassNames) {
      if (!classNames.includes(selectorClassName)) {
        return false
      }
    }
    return true
  }
}
