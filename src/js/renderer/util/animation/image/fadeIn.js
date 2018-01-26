//@flow
import anime from 'animejs'
import type { AnimationStyle } from '../ImageAnimation'

export default (selector: string): AnimationStyle => {
  const startStyle = {
    opacity: 0,
  }
  let animationStyle = Object.assign({}, startStyle)

  let animeController = anime({
    targets: selector,
    opacity: 1,
    easing: 'linear',
    duration: 2000,
    autoplay: false,
  })

  return {
    startStyle,
    endStyle: {
      opacity: 1,
    },
    animeController,
  }
}
