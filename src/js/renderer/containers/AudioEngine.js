//@flow
import React from 'react'
import store from '../main/store'
import engine from '../main/engine'
import audioEffectList from '../config/audioEffectList'
import { connect } from 'react-redux'
import { generateAudioNodeKey } from '../util/audio/generateAudioNodeKey'
import { loadAudioBus } from '../actions/actions'
import AudioBus from '../components/audio/AudioBus'
const AudioContext = window.AudioContext || window.webkitAudioContext
const AudioNode = window.AudioNode || window.webkitAudioNode
const Audio = window.Audio

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

    // Config で定義されている AudioBus を読み込み
    const config = engine.getVar('config')
    if (config.audio && config.audio.bus) {
      config.audio.bus.forEach(bus => {
        if (!this.props.audioState.audioBuses[bus.name]) {
          store.dispatch(loadAudioBus(bus.name, bus.out, bus.gain))
        }
      })
    }
  }

  render() {
    this.updateAudioBuses()

    let audioBusComponents = []
    Object.keys(this.props.audioState.audioBuses).forEach(key => {
      const audioBusState = this.props.audioState.audioBuses[key]
      audioBusComponents.push(
        <AudioBus
          key={key}
          audioCxt={this.audioCxt}
          audioBusState={audioBusState}
          audioNodeMap={this.audioBuses.get(key)}
          nextAudioNode={getNextAudioNode(
            key,
            this.props.audioState.audioBuses,
            this.audioBuses,
            this.audioCxt.destination
          )}
          nextAudioBusName={audioBusState.out}
        />
      )
    })

    return <div className="ender-audio-engine">{audioBusComponents}</div>
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
  audioBuses: Map<string, Map<string, AudioNode>>,
  defaultNextAudioNode: AudioNode
): AudioNode {
  const audioBusState = audioBusStates[key]

  if (!audioBusState.out) {
    return defaultNextAudioNode
  }

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
      return audioCxt.createGain()
    case 'gain':
      return audioCxt.createGain()
    default:
      console.warn('undefined audio node type!!', audioNodeState)
      return null
  }
}

const mapStateToProps = state => {
  return {
    audioState: state.audio,
  }
}

export default connect(mapStateToProps)(AudioEngine)
