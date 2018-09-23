import { generateAudioNodeKey } from './generateAudioNodeKey'
import { AUDIO_NODE_TYPE_LIST } from '../../config/audioNodeTypeList'

export function generateAudioBusState(out, src) {
  const inGainNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.GAIN)
  const outGainNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.GAIN)
  let nodes = {}
  nodes[inGainNodeKey] = {
    type: AUDIO_NODE_TYPE_LIST.GAIN,
    gain: 1.0,
  }
  nodes[outGainNodeKey] = {
    type: AUDIO_NODE_TYPE_LIST.GAIN,
    gain: 1.0,
  }
  return {
    out,
    nodes,
    firstNode: inGainNodeKey,
    lastNode: outGainNodeKey,
    nodeOrder: [],
  }
}
