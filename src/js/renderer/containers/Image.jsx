import React from 'react'
import path from 'path'
import engine from '../main/engine'
import ImageAnimation from '../util/animation/ImageAnimation'
import { startAnimation } from '../actions/actions'
import store from '../main/store'
import { get } from 'lodash'

const getImageId = (src, classNames) => {
  return src.replace(/[\/\.\\]/, '') + classNames.join('-')
}

export default class Image extends React.Component {
  componentWillMount() {
    if (this.props.effect) {
      let appearAnimation = new ImageAnimation(
        `#${this.props.id}`,
        this.props.effect,
        true
      )
      this.setState({ appearAnimation })
      store.dispatch(startAnimation(appearAnimation))
    }
  }

  onLoad() {
    // 出現時アニメーション再生
    if (get(this, 'state.appearAnimation')) {
      this.state.appearAnimation.start()
      this.setState({})
      // 出現アニメーションがある場合は animation.finish で engine.exec() される
    } else {
      // img 命令完了
      engine.exec()
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
        id={this.props.id}
        style={this.props.style}
        onLoad={this.onLoad}
      />
    )
  }
}
