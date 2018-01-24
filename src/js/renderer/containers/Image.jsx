//@flow
import React from 'react'
import store from '../main/store'
import {startAnimation} from '../actions/actions'
import {get} from 'lodash'
import path from 'path'
import engine from '../main/engine'

import ImageAnimation from '../util/animation/ImageAnimation'

type Props = {
  src: string,
  classList: string[],
  effect: string,
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
    store.dispatch(startAnimation(imageAnimation))
    imageAnimation.start()
  }
  const srcPath = path.join(
    engine.getVar('config.basePath'),
    engine.getVar('config.image.path', ''),
    src
  )
  return (
    <img
      className={`ender-image ${classList.join(' ')}`}
      src={srcPath}
      onLoad={onLoad}
      id={getImageId(src, classList)}
    />
  )
}

export default Image
