import { generateAudioNodeKey } from './generateAudioNodeKey'
import { generateAudioNodeState } from './generateAudioNodeState'
import { AUDIO_NODE_TYPE_LIST } from '../../config/audioNodeTypeList'

export function generateAudioSrcBusState(out, src, isLoop, loopOffsetTime) {
  const srcNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.SOURCE)
  const gainNodeKey = generateAudioNodeKey(AUDIO_NODE_TYPE_LIST.GAIN)

  return {
    out,
    nodes: {
      [srcNodeKey]: generateAudioNodeState(AUDIO_NODE_TYPE_LIST.SOURCE, {
        src,
        isLoop,
        loopOffsetTime,
      }),
      [gainNodeKey]: generateAudioNodeState(AUDIO_NODE_TYPE_LIST.GAIN, {
        gain: 1.0,
      }),
    },
    firstNode: srcNodeKey,
    lastNode: gainNodeKey,
    nodeOrder: [],
  }
}
