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
    this.audioBuses = updateAudioBuses(
      this.audioCxt,
      this.props.audioState,
      this.audioBuses
    )

    // エフェクト開始
    this.props.audioState.audioEffects.forEach(audioEffect => {
      if (audioEffect.isStarted) return
      const audioEffectNodes = getAudioEffectNodes(
        this.props.audioState.audioBuses,
        this.audioBuses,
        audioEffect.targetBus,
        audioEffect.key
      )
      if (Object.keys(audioEffectNodes).length < 1) return
      audioEffect.start(this.audioCxt, audioEffectNodes, audioEffect.complete)
    })

    const audioBusComponents = Object.keys(
      this.props.audioState.audioBuses
    ).map(key => {
      const audioBusState = this.props.audioState.audioBuses[key]
      return (
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
}

function getAudioEffectNodes(
  audioBusStates: { [string]: AudioBusState },
  audioBuses: Map<string, Map<string, AudioNode>>,
  busKey: string,
  effectKey: string
): { [string]: AudioNode } {
  const targetBusState = audioBusStates[busKey]

  const audioEffectNodeKeys = Object.keys(targetBusState.nodes).filter(
    nodeKey => {
      return targetBusState.nodes[nodeKey].audioEffectKey === effectKey
    }
  )

  const targetBus = audioBuses.get(busKey)

  if (!targetBus) {
    console.warn(`not loaded audio bus!! audioBusKey: ${busKey}`)
    return {}
  }

  // {nodeState.name: AudioNode} となるオブジェクトに整形
  let audioEffectNodes = {}
  audioEffectNodeKeys.forEach(audioEffectNodeKey => {
    if (!targetBus.has(audioEffectNodeKey)) {
      console.warn(
        `not loaded audio node!! audioNodeKey: ${audioEffectNodeKey}`
      )
      return {}
    }
    const name = targetBusState.nodes[audioEffectNodeKey].name
    if (!name) {
      console.warn(
        `not defined audio node name!! audioNodeKey: ${audioEffectNodeKey}`
      )
      return {}
    }
    audioEffectNodes[name] = targetBus.get(audioEffectNodeKey)
  })

  return audioEffectNodes
}

function updateAudioBuses(
  audioCxt: AudioContext,
  audioState: AudioState,
  audioBuses: Map<string, Map<string, AudioNode>>
): Map<string, Map<string, AudioNode>> {
  const audioBusKeys = audioBuses.keys()
  const audioBusStateKeys = Object.keys(audioState.audioBuses)

  audioBusStateKeys.forEach(key => {
    const audioBusState = audioState.audioBuses[key]
    if (!audioBuses.has(key)) {
      audioBuses.set(key, createAudioNodeMap(audioCxt, audioBusState))
    } else {
      updateAudioNodeMap(audioBuses.get(key), audioCxt, audioBusState)
    }
  })

  return audioBuses
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

const mapStateToProps = state => {
  return {
    audioState: state.audio,
  }
}

export default connect(mapStateToProps)(AudioEngine)
