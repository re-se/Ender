//@flow
import anime from 'animejs'
import type { AnimationStyle } from '../ImageAnimation'

export default (selector: string, onComplete: () => void): AnimationStyle => {
  let animeController = anime({
    targets: selector,
    opacity: [0, 1],
    easing: 'linear',
    duration: 2000,
    autoplay: false,
    complete: onComplete,
  })

  return {
    endStyle: {
      opacity: 1,
    },
    animeController,
  }
}
