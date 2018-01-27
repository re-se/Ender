//@flow
import type { FuncInst } from '../main/instMap'
import componentList from '../config/componentList'

export default class ComponentUtil {
  /**
   * コンポーネントの引数をオブジェクトに変換して取得
   * @param  {FuncInst} inst
   * @return {ComponentProps}
   */
  static getPropsFromInst(inst: FuncInst, key: string): ComponentProps {
    let props = inst.args ? componentList[inst.name].getProps(inst.args) : {}
    if (props.children) {
      props.children = props.children.map(child => {
        ComponentUtil.generateComponentState(child, key)
      })
    }
    return props
  }

  /**
   * Stateにさすコンポーネントのオブジェクトを命令から再帰的に生成する
   * @param  {FuncInst} inst
   * @param  {string} key
   * @return {ComponentState}
   */
  static generateComponentState(inst: FuncInst, key: string): ComponentState {
    return {
      type: inst.type,
      name: inst.name,
      key,
      props: ComponentUtil.getPropsFromInst(inst, key),
    }
  }

  /**
   * 指定のコンポーネントがセレクタの対象になるか判定
   * 現状並列のクラスのみに対応
   * @param  {ComponentState} component
   * @param  {string[]} selectorClassNames
   * @return {boolean}
   */
  static matchSelector(
    component: ComponentState,
    selectorClassNames: string[]
  ): boolean {
    let classNames = component.props.classNames || []

    for (const selectorClassName of selectorClassNames) {
      if (!classNames.includes(selectorClassName)) {
        return false
      }
    }
    return true
  }
}
