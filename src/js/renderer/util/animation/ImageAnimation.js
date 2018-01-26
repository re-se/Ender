//@flow
import anime from 'animejs'
import Animation from './Animation'
import store from '../../main/store'
import { updateAnimationStyle } from '../../actions/actions'

export type AnimationStyle = {
  startStyle?: Object,
  endStyle: Object,
  animeController: any, //TODO:Animejsの返り型
}

export default class ImageAnimation extends Animation {
  effectName: string
  /**
   * エフェクト名に対応したアニメーションを生成する関数
   * @param  {string} エフェクト名
   * @return {AnimationStyle}
   */
  animation: string => AnimationStyle
  startStyle: Object | null
  endStyle: Object
  animationController: any //TODO:Animejsの返り型

  constructor(selector: string, effectName: string) {
    super()
    this.selector = selector
    this.selectorClassNames = getClassNamesFromSelector(selector)

    this.effectName = effectName

    this.animation = require(`./image/${effectName}`).default

    const animationStyle = this.animation(this.selector)
    this.startStyle = animationStyle.startStyle || null
    this.endStyle = animationStyle.endStyle
    this.animationController = animationStyle.animeController
  }

  start() {
    this.animationController.play()
    this.isStarted = true
  }

  finish() {
    this.animationController.pause()
    anime.remove(this.selector)
    this.isFinished = true
  }

  onExec() {
    this.finish()
  }
}

const selectorClassPattern = /\.([^ \.]+)/g

const getClassNamesFromSelector = (selector: string) => {
  let classNames = selector.match(selectorClassPattern)
  return classNames == null
    ? []
    : classNames.map(className => {
        return className.substring(1)
      })
}
