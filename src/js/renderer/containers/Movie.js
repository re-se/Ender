import React from 'react'
import path from 'path'
import engine from '../main/engine'

export default class Movie extends React.Component {
  render() {
    const srcPath = path.join(
      engine.getVar('config.basePath'),
      engine.getVar('config.movie.path', ''),
      this.props.src
    )

    return (
      <video
        className={`ender-movie ${this.props.classNames.join(' ')}`}
        src={srcPath}
        id={this.props.id}
        style={this.props.style}
        autoPlay
        loop={this.props.isLoop}
        onEnded={this.props.onEnded.bind(this)}
      />
    )
  }
}
