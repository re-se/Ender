//@flow
import React from 'react'
import store from '../main/store'
import audioEffectList from '../config/audioEffectList'
import { connect } from 'react-redux'
import { generateAudioNodeKey } from '../util/audio/generateAudioNodeKey'
import { AudioBus } from '../components/audio/AudioBus'
const AudioContext = window.AudioContext || window.webkitAudioContext
const AudioNode = window.AudioNode || window.webkitAudioNode
const Audio = window.Audio

type AudioEffectState = {
  key: string,
  async: boolean,
  effect: string,
}

type AudioBusState = {
  out: string,
  nodeOrder: string[],
  firstNode: string,
  lastNode: string,
  nodes: { [string]: AudioNodeState },
}

type AudioState = {
  audioEffects: AudioEffectState[],
  audioBuses: { [string]: AudioBusState },
}

interface AudioNodeState {
  type: string;
  src?: string;
}

type Props = {
  audioState: AudioState,
}

type State = {}

class AudioEngine extends React.Component<Props, State> {
  audioCxt: AudioContext
  audioBuses: Map<string, Map<string, AudioNode>>
  audios: Map<string, Audio>

  constructor(props) {
    super(props)

    this.audioCxt = new AudioContext()
    this.audioBuses = new Map()
  }

  render() {
    this.updateAudioBuses()

    let audioBusComponents = []
    Object.keys(this.props.audioState.audioBuses).forEach(key => {
      audioBusComponents.push(
        <AudioBus
          audioBusState={this.props.audioState.audioBuses[key]}
          audioNodeMap={this.audioBuses.get(key)}
          nextAudioNode={getNextAudioNode(
            key,
            this.props.audioState.audioBuses,
            this.audioBuses
          )}
        />
      )
    })

    return <div>{audioBusComponents}</div>
  }

  updateAudioBuses() {
    const audioBusKeys = this.audioBuses.keys()
    const audioBusStateKeys = Object.keys(this.props.audioState.audioBuses)

    audioBusStateKeys.forEach(key => {
      const audioBusState = this.props.audioState.audioBuses[key]
      if (!this.audioBuses.has(key)) {
        this.audioBuses.set(
          key,
          createAudioNodeMap(this.audioCxt, audioBusState)
        )
      } else {
        updateAudioNodeMap(
          this.audioBuses.get(key),
          this.audioCxt,
          audioBusState
        )
      }
    })
  }
}

/**
 */
function getNextAudioNode(
  key: string,
  audioBusStates: { [string]: AudioBusState },
  audioBuses: Map<string, Map<string, AudioNode>>
) {
  const audioBusState = audioBusStates[key]
  const nextAudioBusState = audioBusStates[audioBusState.out]
  const nextAudioNodeMap = audioBuses.get(audioBusState.out)
  if (!nextAudioNodeMap) {
    console.warn(`invalid audio bus name!! name = ${audioBusState.out}`)
    return null
  }
  return nextAudioNodeMap.get(nextAudioBusState.firstNode)
}

/**
 * AudioBus が持つ AudioNode を全てインスタンス化する
 */
function createAudioNodeMap(
  audioCxt: AudioContext,
  audioBusState: AudioBusState
): Map<string, AudioNode> {
  let audioNodeMap: Map<string, AudioNode> = new Map()

  Object.keys(audioBusState.nodes).forEach(key => {
    const audioNodeState = audioBusState.nodes[key]
    audioNodeMap.set(key, createAudioNode(audioCxt, audioNodeState))
  })

  return audioNodeMap
}

/**
 */
function updateAudioNodeMap(
  audioNodeMap: Map<string, AudioNode>,
  audioCxt: AudioContext,
  audioBusState: AudioBusState
): Map<string, AudioNode> {
  let audioBusKeys = Object.keys(audioBusState.nodes)

  // state から消えている AudioNode は削除
  audioNodeMap.forEach((audioNode, key) => {
    if (!audioBusKeys.includes(key)) {
      audioNodeMap.delete(key)
    }
  })

  // まだインスタンス化されていない AudioNode はインスタンス化
  audioBusKeys.forEach(key => {
    if (!audioNodeMap.has(key)) {
      audioNodeMap.set(key, createAudioNode(audioCxt, audioBusState.nodes[key]))
    }
  })

  return audioNodeMap
}

/**
 */
function createAudioNode(
  audioCxt: AudioContext,
  audioNodeState: AudioNodeState
): AudioNode {
  switch (audioNodeState.type) {
    case 'source':
      return audioCxt.createMediaElementSource()
    case 'gain':
      return audioCxt.createGain()
    default:
      console.warn('undefined audio node type!!', audioNodeState)
      return null
  }
}

/** memo
declare interface AudioNodeState {
  type: string,
}

declare type AudioElementNodeState implements AudioNode = {
  src: string,
}

declare type GainNodeState implements AudioNode = {
  type: string,
  gain: number,
}

declare type BiquidFilterNodeState implements AudioNode = {
  type: string,
  frequency: number,
  detune: number,
  q: number,
  gain: number,
  filterType: string,
}
 */

const mapStateToProps = state => {
  return {
    audioState: state.audio,
  }
}

export default connect(mapStateToProps)(AudioEngine)
