//@flow
import React from 'react'
import store from '../main/store'
import { startAnimation } from '../actions/actions'
import { get } from 'lodash'
import path from 'path'
import engine from '../main/engine'

import ImageAnimation from '../util/animation/ImageAnimation'

type Props = {
  src: string,
  classNames: string[],
  effect: string,
}

const getImageId = (src, classNames) => {
  return src.replace(/[\/\.\\]/, '') + classNames.join('-')
}

const Image = ({ src, classNames, effect }: Props) => {
  const onLoad = () => {
    const imageAnimation = new ImageAnimation(
      `#${getImageId(src, classNames)}`,
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
      className={`ender-image ${classNames.join(' ')}`}
      src={srcPath}
      onLoad={onLoad}
      id={getImageId(src, classNames)}
    />
  )
}

export default Image
