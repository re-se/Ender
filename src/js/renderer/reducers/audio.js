//@flow
import { generateAudioNodeKey } from '../util/audio/generateAudioNodeKey'
import { generateAudioEffectKey } from '../util/audio/generateAudioEffectKey'
import { generateAudioNodeState } from '../util/audio/generateAudioNodeState'
import { generateAudioEffectNodeState } from '../util/audio/generateAudioEffectNodeState'
import { generateAudioBusState } from '../util/audio/generateAudioBusState'
import { generateAudioSrcBusState } from '../util/audio/generateAudioSrcBusState'
import { AUDIO_NODE_TYPE_LIST } from '../config/audioNodeTypeList'
import AudioEffect from '../util/audio/AudioEffect'

const audio = (state = { audioEffects: [], audioBuses: {} }, action) => {
  switch (action.type) {
    case 'LOAD_AUDIO':
      return _loadAudio(state, action.src, action.out)

    case 'PLAY_AUDIO':
      // ロードされていなければ、ロードする
      if (!state.audioBuses[action.src]) {
        state = _loadAudio(
          state,
          action.src,
          action.out,
          action.isLoop,
          action.loopOffsetTime
        )
      }

      return _updateAudioNode(
        state,
        action.src,
        state.audioBuses[action.src].firstNode,
        { isPlay: true }
      )

    case 'STOP_AUDIO':
      // return _updateAudioNode(
      //   state,
      //   action.bus,
      //   state.audioBuses[action.bus].firstNode,
      //   { isPlay: false, currentTime: 0 }
      // )
      return _deleteAudio(state, action.bus)

    case 'PAUSE_AUDIO':
      return _updateAudioNode(
        state,
        action.bus,
        state.audioBuses[action.bus].firstNode,
        { isPlay: false }
      )

    case 'LOAD_AUDIO_BUS':
      return _loadAudioBus(state, action.name, action.out, action.gain)

    case 'LOAD_AUDIO_EFFECT': {
      const audioEffect = action.audioEffect
      let newState = _addAudioEffect(state, audioEffect)
      // AudioEffect に使用する AudioNode を state に追加
      Object.keys(audioEffect.effector.nodes).forEach(nodeKey => {
        const node = audioEffect.effector.nodes[nodeKey]
        newState = _addAudioEffectNode(
          newState,
          audioEffect.targetBus,
          audioEffect.key,
          nodeKey,
          node.type,
          node.params
        )
      })
      return newState
    }

    case 'DELETE_AUDIO_EFFECT': {
      const audioEffect = action.audioEffect
      const newNodes = { ...state.audioBuses[audioEffect.targetBus].nodes }
      Object.keys(state.audioBuses[audioEffect.targetBus].nodes).forEach(
        nodeKey => {
          const nodeState =
            state.audioBuses[audioEffect.targetBus].nodes[nodeKey]
          if (nodeState.audioEffectKey === audioEffect.key) {
            delete newNodes[nodeKey]
          }
        }
      )

      const newNodeKeys = Object.keys(newNodes)
      const newNodeOrder = state.audioBuses[
        audioEffect.targetBus
      ].nodeOrder.filter(nodeKey => newNodeKeys.includes(nodeKey))

      return {
        audioEffects: state.audioEffects.filter(
          audioEffectState => audioEffectState.key !== audioEffect.key
        ),
        audioBuses: {
          ...state.audioBuses,
          [audioEffect.targetBus]: {
            ...state.audioBuses[audioEffect.targetBus],
            nodeOrder: newNodeOrder,
            nodes: newNodes,
          },
        },
      }
    }

    default:
      return state
  }
}

function _updateAudioNode(
  state: AudioState,
  audioBusKey: string,
  audioNodeKey: string,
  updateParams: Object
): AudioState {
  return {
    ...state,
    audioBuses: {
      ...state.audioBuses,
      [audioBusKey]: {
        ...state.audioBuses[audioBusKey],
        nodes: {
          ...state.audioBuses[audioBusKey].nodes,
          [audioNodeKey]: {
            ...state.audioBuses[audioBusKey].nodes[audioNodeKey],
            ...updateParams,
          },
        },
      },
    },
  }
}

function _deleteAudio(state: AudioState, audioBusKey: string): AudioState {
  const newAudioState = { ...state }
  delete newAudioState.audioBuses[audioBusKey]
  return newAudioState
}

function _loadAudio(state: AudioState, src, out, isLoop, loopOffsetTime) {
  return {
    ...state,
    audioBuses: {
      ...state.audioBuses,
      [src]: generateAudioSrcBusState(out, src, isLoop, loopOffsetTime),
    },
  }
}

function _loadAudioBus(state: AudioState, name, out, gain) {
  return {
    ...state,
    audioBuses: {
      ...state.audioBuses,
      [name]: generateAudioBusState(out, gain),
    },
  }
}

function _addAudioEffectNode(
  state: AudioState,
  audioBusKey: string,
  audioEffectKey: string,
  name: string,
  type: string,
  params: Object
) {
  const audioEffectNodeKey = generateAudioNodeKey(type)
  return {
    ...state,
    audioBuses: {
      ...state.audioBuses,
      [audioBusKey]: {
        ...state.audioBuses[audioBusKey],
        nodeOrder: [
          ...state.audioBuses[audioBusKey].nodeOrder,
          audioEffectNodeKey,
        ],
        nodes: {
          ...state.audioBuses[audioBusKey].nodes,
          [audioEffectNodeKey]: generateAudioEffectNodeState(
            type,
            params,
            audioEffectKey,
            name
          ),
        },
      },
    },
  }
}

function _addAudioEffect(
  state: AudioState,
  audioEffect: AudioEffect
): AudioState {
  return {
    ...state,
    audioEffects: [...state.audioEffects, audioEffect],
  }
}

export default audio
