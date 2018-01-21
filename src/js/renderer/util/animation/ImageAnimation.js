//@flow
import Animation from './Animation'
import store from '../../main/store'
import { updateAnimationStyle } from '../../actions/actions'

export type AnimationStyle = {
  startStyle?: Object,
  endStyle: Object,
  animationStyle: Object,
  animeController: any //TODO:Animejsの返り値
}

export default class ImageAnimation extends Animation {
  selector: string
  effectName: string
  /**
   * エフェクト名に対応したアニメーションを生成する関数
   * @param  {string} エフェクト名
   * @param  {Function} アップデート関数
   * @return {AnimationStyle}
   */
  animation: (string, Function) => AnimationStyle
  startStyle: Object
  endStyle: Object
  animationStyle: Object
  animeController: any //TODO:Animejsの返り値

  constructor(selector: string, effectName: string) {
    super()
    this.selector = selector
    this.effectName = effectName
    this.animation = require(`./image/${effectName}`).default
  }

  start() {
    const animationStyle = this.animation(
      this.selector,
      () => {
        store.dispatch(updateAnimationStyle(this))
      }
    )

    this.startStyle = animationStyle.startStyle? animationStyle.startStyle : {}
    this.endStyle = animationStyle.endStyle
    this.animationStyle = animationStyle.animationStyle

    store.dispatch(updateAnimationStyle(this))
  }

  finish() {
    this.isFinished = true
    this.animeController.pause()
    this.animationStyle = this.endStyle
    store.dispatch(updateAnimationStyle(this))
  }

  onExec() {
    this.finish()
  }
}
