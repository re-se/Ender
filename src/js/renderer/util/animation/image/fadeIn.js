//@flow
import { TimelineMax } from 'gsap'

export default (targetClassName: string, onComplete: () => void): TimelineMax => {
  let timeLine = new TimelineMax({ onComplete: onComplete })
  timeLine.to(targetClassName, 0, { opacity: 0 })
  timeLine.to(targetClassName, 1, { opacity: 1, display: "block" })
  return timeLine
}
