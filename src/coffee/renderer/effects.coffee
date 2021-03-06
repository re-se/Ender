gsap = require 'gsap'
TimelineMax = gsap.TimelineMax
module.exports = {
  fadeIn: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, 0, opacity: 0)
      .to(target, 1, {opacity: 1, display: "block"})
    tl
  fadeOut: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, 0, opacity: 1)
      .to(target, 1, opacity: 0)
    tl
  show: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, 0, opacity: 0)
      .to(target, 1, {opacity: 1, display: "block"})
    tl
  hide: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, 0, opacity: 1)
      .to(target, 1, {opacity: 0, display: "none"})
    tl
  shake: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, 0, {position: "absolute", left: 0, top: 0})
      .to(target, 0.1, {left: -10 * Math.random(), top: 10 * Math.random()})
      .to(target, 0.1, {left: 10 * Math.random(), top: -10 * Math.random()})
      .to(target, 0.1, {left: -10 * Math.random(), top: 10 * Math.random()})
      .to(target, 0.1, {left: 10 * Math.random(), top: -10 * Math.random()})
      .to(target, 0, {left: 0, top: 0})
  pyokopyoko: (target, onComplete) ->
    tl = new TimelineMax(onComplete: onComplete)
    tl.to(target, .2, y: -15)
      .to(target, .2, y: 0)
      .to(target, .2, y: -15)
      .to(target, .2, y: 0)
}
