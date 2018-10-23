//@flow
import anime from 'animejs'
import { AnimationLibrary } from './AnimationLibrary'
import ImageAnimation from '../ImageAnimation'
import store from '../../../main/store'
import { updateComponentStyle } from '../../../actions/actions'

type Setting = {
  style: {},
  before: {},
  after: {},
}

/**
 * animejs のラッパー
 * https://github.com/juliangarnier/anime/
 */
export default class Animejs implements AnimationLibrary {
  animation: any
  style: {}
  endStyle: {}
  selector: Selector[]

  constructor(animation: ImageAnimation, setting: Setting) {
    this.selector = animation.selectorTree
    this.endStyle = setting.after || {}
    const style = setting.style
    this.style = { ...style, ...setting.before }
    let prop = {
      targets: this.style,
      ...setting,
      ...style,
    }
    this.animation = new anime(prop)
    this.animation.update = () => {
      if (typeof setting.update === 'function') {
        setting.update()
      }
      store.dispatch(updateComponentStyle(this.selector, this.style))
    }

    this.animation.complete = () => {
      if (typeof setting.complete === 'function') {
        setting.complete()
      }
      animation.finish()
    }
  }

  start() {
    this.animation.play()
  }

  finish() {
    this.animation.pause()
    store.dispatch(
      updateComponentStyle(this.selector, {
        ...this.style,
        ...this.endStyle,
      })
    )
  }

  pause() {
    this.animation.pause()
  }
}
