//@flow
import anime from 'animejs'
import { AnimationLibrary } from './AnimationLibrary'
import ImageAnimation from '../ImageAnimation'
import StyleUtil from '../../StyleUtil'

/**
 * animejs のラッパー
 * https://github.com/juliangarnier/anime/
 */
export default class Animejs implements AnimationLibrary {
  start(animation: ImageAnimation) {
    animation.animationController.play()
  }

  finish(animation: ImageAnimation) {
    animation.animationController.pause()
    anime.remove(StyleUtil.toString(animation.selectorTree))
  }

  pause(animation: ImageAnimation) {
    animation.animationController.pause()
  }
}
