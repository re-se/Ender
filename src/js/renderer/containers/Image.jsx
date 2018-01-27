import React from 'react'
import path from 'path'
import engine from '../main/engine'
import AnimationUtil from '../util/AnimationUtil'
import ImageAnimation from '../util/animation/ImageAnimation'
import { startAnimation } from '../actions/actions'
import store from '../main/store'

const getImageId = (src, classNames) => {
  return src.replace(/[\/\.\\]/, '') + classNames.join('-')
}

export default class Image extends React.Component {
  componentDidMount() {
    if (this.props.effect) {
      store.dispatch(
        startAnimation(
          new ImageAnimation(
            `#${getImageId(this.props.src, this.props.classNames)}`,
            this.props.effect
          )
        )
      )
    }
  }

  render() {
    const srcPath = path.join(
      engine.getVar('config.basePath'),
      engine.getVar('config.image.path', ''),
      this.props.src
    )
    return (
      <img
        className={`ender-image ${this.props.classNames.join(' ')}`}
        src={srcPath}
        id={getImageId(this.props.src, this.props.classNames)}
      />
    )
  }
}
