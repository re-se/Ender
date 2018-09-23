import { generateAudioNodeKey } from './generateAudioNodeKey'
import { AUDIO_NODE_TYPE_LIST } from '../../config/audioNodeTypeList'

export function generateAudioSrcBusState(out, src) {
  const srcNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.SOURCE)
  const gainNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.GAIN)
  let nodes = {}
  nodes[srcNodeKey] = {
    type: AUDIO_NODE_TYPE_LIST.SOURCE,
    src,
    currentTime: 0,
    isPlay: false,
  }
  nodes[gainNodeKey] = {
    type: AUDIO_NODE_TYPE_LIST.GAIN,
    gain: 1.0,
  }
  return {
    out,
    nodes,
    firstNode: srcNodeKey,
    lastNode: gainNodeKey,
    nodeOrder: [],
  }
}
