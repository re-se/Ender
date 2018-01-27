//@flow
import anime from 'animejs'
import type { AnimationStyle } from '../ImageAnimation'

export default (selector: string): AnimationStyle => {
  let animeController = anime({
    targets: selector,
    opacity: [0, 1],
    easing: 'linear',
    duration: 2000,
    autoplay: false,
  })

  return {
    endStyle: {
      opacity: 1,
    },
    animeController,
  }
}
