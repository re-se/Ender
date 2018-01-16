//@flow
import React from 'react'
import store from '../main/store'
import { startAnimation } from '../actions/actions'

import ImageAnimation from '../util/animation/ImageAnimation'

type Props = {
  src: string,
  classList: string[],
  effect: string
}

const Image = ({src, classList, effect}: Props) => {
  const onLoad = () => {
    store.dispatch(startAnimation(new ImageAnimation(effect)))
  }
  return (
    <img className={`ender-image ${classList.join(' ')}`} src={src} onLoad={onLoad}/>
  )
}

export default Image
