//@flow
import type { FuncInst } from '../main/instMap'
import Animation from './animation/Animation'
import ComponentUtil from './ComponentUtil'
import { startAnimation } from '../actions/actions'
import store from '../main/store'

export default class AnimationUtil {
  /**
   * アニメーションをゲームにセットする
   * @param  {Animation} animation
   * @return {void}
   */
  static setAnimation(animation: Animation): void {
    store.dispatch(startAnimation(animation))
  }

  /**
   * アニメーションを開始するコールバック関数を生成
   * @param  {Animation[]} animations
   * @return {()=>void)}
   */
  static generateAnimationStartFunc(animations: Animation[]): () => void {
    return () => {
      for (let animation of animations) {
        // 多重起動防止
        if (!animation.isStarted) {
          animation.start()
        }
      }
    }
  }

  /**
   * アニメーションの対象になるか判定
   * @param  {ComponentState}  component
   * @param  {Animation}  animation
   * @return {boolean}
   */
  static isAvailableAnimation(animation: Animation, component: ComponentState) {
    if (animation.isStarted) {
      return false
    }
    return ComponentUtil.matchSelector(component, animation.selectorClassNames)
  }
}
