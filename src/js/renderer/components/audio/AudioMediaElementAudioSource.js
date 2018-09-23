//@flow
import React from 'react'
import path from 'path'
import engine from '../../main/engine'
const MediaElementAudioSource = window.MediaElementAudioSource
const Audio = window.Audio

type Props = {
  src: string,
  audioNode: MediaElementAudioSourceNode,
  isPlay: boolean,
  currentTime: number,
  audioCxt: AudioContext,
}

type State = {}

class AudioMediaElementAudioSource extends React.Component<Props, State> {
  audio: Audio
  audioNode: MediaElementAudioSource

  constructor(props: Props) {
    super(props)
    const srcPath = path.join(
      engine.getVar('config.basePath'),
      engine.getVar('config.audio.path', ''),
      this.props.src
    )
    this.audio = new Audio(srcPath)
    this.audioNode = this.props.audioCxt.createMediaElementSource(this.audio)
    this.audioNode.connect(this.props.audioNode)
  }

  render() {
    if (this.props.isPlay && this.audio.paused) {
      this.audio.play()
    } else if (!this.props.isPlay && !this.audio.paused) {
      this.audio.pause()
    }

    if (this.audio.currentTime !== this.props.currentTime) {
      this.audio.currentTime = this.props.currentTime
    }

    return null
  }
}

export default AudioMediaElementAudioSource
