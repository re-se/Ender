//@flow
import Animation from './Animation'
import { TimelineMax } from 'gsap'

export default class ImageAnimation extends Animation {
  selector: string
  effectName: string
  timeline: TimelineMax
  animation: Function

  constructor(selector: string, effectName: string) {
    super()
    this.selector = selector
    this.effectName = effectName
    this.animation = require(`./image/${effectName}`).default
    this.timeline = this._loadTimeline()
  }

  _loadTimeline() {
    let self = this
    const timeline = new TimelineMax(() => {
      self.isFinished = true
    })
    this.animation(timeline, this.selector)
    return timeline
  }

  start() {
    console.log(this.selector)
    this.timeline.play()
  }

  onExec() {
    this.timeline.progress(1, false)
    this.isFinished = true
  }
}
