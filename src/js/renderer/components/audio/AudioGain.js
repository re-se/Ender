import React from 'react'

export type Props = {
  gainNode: GainNode,
  gain: number,
}

const AudioGain = ({ gainNode = null, gain = 1.0 }: Props) => {
  gainNode.gain = gain

  return <div gain={gain} />
}

export default AudioGain
