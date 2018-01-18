//@flow
import { TimelineMax } from 'gsap'

export default (timeline: TimelineMax, selector: string): void => {
  timeline.to(selector, 0, { opacity: 0 })
  timeline.to(selector, 1, { opacity: 1, display: "block" })
}
