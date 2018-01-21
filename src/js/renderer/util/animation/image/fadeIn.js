//@flow
import anime from 'animejs'
import type { AnimationStyle } from '../ImageAnimation'

export default (selector: string, onUpdate: Function): AnimationStyle => {
  const startStyle = {
    opacity: 0
  }
  let animationStyle = Object.assign({}, startStyle)

  anime({
    targets: animationStyle,
    opacity: 1,
    easing: 'linear',
    duration: 2000,
    update: onUpdate
  })

  return {
    startStyle: startStyle,
    endStyle: {
      opacity: 1
    },
    animationStyle: animationStyle
  }
}
