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

const getImageId = (src, classList) => {
  return src.replace(/[\/\.\\]/, '') + classList.join('-')
}

const Image = ({src, classList, effect}: Props) => {
  const onLoad = () => {
    const imageAnimation = new ImageAnimation(
      `#${getImageId(src, classList)}`,
      effect
    )
    imageAnimation.start()
    store.dispatch(startAnimation(imageAnimation))
  }
  return (
    <img className={`ender-image ${classList.join(' ')}`} src={src} onLoad={onLoad} id={getImageId(src, classList)}/>
  )
}

export default Image
