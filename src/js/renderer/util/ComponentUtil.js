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
   * @param  {ComponentState} component
   * @param  {Selector[]} selector
   * @return {boolean}
   */
  static matchSelector(
    component: ComponentState,
    selector: Selector[]
  ): boolean {
    let classNames = component.props.classNames || []
    let idName = component.props.id || ''

    for (const selectorElement of selector) {
      if (selectorElement.type === 'classSelector') {
        if (!classNames.includes(selectorElement.value)) {
          return false
        }
      } else if (selectorElement.type === 'idSelector') {
        if (idName !== selectorElement.value) {
          return false
        }
      }
    }
    return true
  }
}
