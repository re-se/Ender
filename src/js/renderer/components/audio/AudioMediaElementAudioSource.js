//@flow
import React from 'react'
import path from 'path'
import engine from '../../main/engine'
import { stopAudio } from '../../actions/actions'
const MediaElementAudioSource = window.MediaElementAudioSource
const Audio = window.Audio

type Props = {
  src: string,
  audioNode: MediaElementAudioSourceNode,
  isPlay: boolean,
  isLoop: boolean,
  loopOffsetTime: number,
  currentTime: number,
  audioCxt: AudioContext,
  nextAudioBusName: string,
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

    if (this.props.isLoop) {
      this.setLoop()
    } else {
      this.setOnComplete()
    }
  }

  setLoop() {
    const offsetTime = this.props.loopOffsetTime || 0

    let audioDom = this.audio
    this.audio.onended = () => {
      audioDom.currentTime = offsetTime
      audioDom.play()
    }
  }

  setOnComplete() {
    const self = this
    this.audio.onended = () => {
      stopAudio(self.props.src)
    }
  }

  componentWillUnmount() {
    this.audio.pause()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.currentTime !== this.props.currentTime) {
      this.audio.currentTime = this.props.currentTime
    }

    if (this.props.isPlay && this.audio.paused) {
      this.audio.play()
    } else if (!this.props.isPlay && !this.audio.paused) {
      this.audio.pause()
    }
  }

  render() {
    return null
  }
}

export default AudioMediaElementAudioSource
