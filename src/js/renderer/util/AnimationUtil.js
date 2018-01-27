//@flow
import type { FuncInst } from '../main/instMap'
import Animation from './animation/Animation'
import ComponentUtil from './ComponentUtil'

export default class AnimationUtil {
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
          // アニメーションに初期値があったらエレメントスタイルに初期値をさす
          if (animation.startStyle) {
            //TODO:指定コンポーネントのStateにスタイル差す方法
          }
          animation.start()
        }
      }
    }
  }

  /**
   * アニメーションの対象になるか判定
   * @param  {FuncInst}  component
   * @param  {Animation}  animation
   * @return {boolean}
   */
  static isAvailableAnimation(animation: Animation, component: FuncInst) {
    if (!animation.isFinished) {
      return false
    }
    return ComponentUtil.matchSelector(component, animation.selectorClassNames)
  }
}
