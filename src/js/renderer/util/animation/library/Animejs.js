//@flow
import anime from 'animejs'
import { AnimationLibrary } from './AnimationLibrary'
import ImageAnimation from '../ImageAnimation'

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
    anime.remove(animation.selector)
  }

  pause(animation: ImageAnimation) {
    animation.animationController.pause()
  }
}
