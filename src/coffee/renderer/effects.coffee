gsap = require 'gsap'
TimelineMax = gsap.TimelineMax
module.exports = {
  fadeIn: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, 0, opacity: 0)
      .to(target, 1, opacity: 1)
    tl
  fadeOut: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, 0, opacity: 1)
      .to(target, 1, opacity: 0)
    tl
}
