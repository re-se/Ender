import React from 'react'

export type Props = {
  gainNode: GainNode,
  gain: number,
}

const AudioGain = ({ gainNode = null, gain = 1.0 }: Props) => {
  gainNode.gain.value = gain

  return null
}

export default AudioGain
