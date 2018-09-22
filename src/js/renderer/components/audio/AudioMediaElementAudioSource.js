//@flow
import React from 'react'

const Audio = window.Audio

type Props = {
  src: string,
  audioNode: MediaElementAudioSourceNode,
  isPlaying: boolean,
  currentTime: number,
}

type State = {}

class AudioMediaElementAudioSource extends React.Component<Props, State> {
  audio: Audio

  constructor(props: Props) {
    super(props)
    this.audio = new Audio(this.props.src)
  }

  render() {
    if (this.props.isPlaying && this.audio.paused) {
      this.audio.play()
    } else if (!this.props.isPlaying && !this.audio.paused) {
      this.audio.pause()
    }

    if (this.audio.currentTime !== this.props.currentTime) {
      this.audio.currentTime = this.props.currentTime
    }

    return (
      <div
        isPlaying={this.props.isPlaying}
        currentTime={this.props.currentTime}
      />
    )
  }
}

export default AudioMediaElementAudioSource
