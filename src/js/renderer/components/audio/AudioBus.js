import React from 'react'
import { AudioGain } from './AudioGain'
import { AudioMediaElementAudioSource } from './AudioMediaElementAudioSource'

export type Props = {
  audioBusState: AudioBusState,
  audioNodeMap: Map<string, AudioNode>,
  nextAudioNode: AudioNode,
}

const AudioBus = ({ audioBusState, audioNodeMap, nextAudioNode }: Props) => {
  connectAudioNodes(audioBusState.nodeOrder, audioNodeMap, nextAudioNode)

  let audioNodeComponents = []
  audioNodeMap.forEach((audioNode, key) => {
    audioNodeComponents.push(
      generateAudioNodeComponent(audioBusState.nodes[key], audioNode)
    )
  })

  return <>{audioNodeComponents}</>
}

/**
 * AudioNode 間の接続を行う
 * 実行の度に全て切断して接続し直す。プレイ時に音が途切れるようなら方法を変える必要あり。
 */
function connectAudioNodes(
  nodeOrder: string[],
  audioNodeMap: Map<string, AudioNode>,
  lastAudioNode: AudioNode
) {
  do {
    let audioNode = audioNodeMap[nodeOrder.shift()]
    let nextAudioNode = audioNodeMap[nodeOrder[0]] || lastAudioNode
    audioNode.disconnect()
    audioNode.connect(nextAudioNode)
  } while (nodeOrder.length > 0)
}

/**
 */
function generateAudioNodeComponent(
  audioNodeState: AudioNodeState,
  audioNode: AudioNode
) {
  switch (audioNodeState.type) {
    case 'source':
      return (
        <AudioMediaElementAudioSource
          {...audioNodeState}
          audioNode={audioNode}
        />
      )
    case 'gain':
      return <AudioGain {...audioNodeState} audioNode={audioNode} />
    default:
      console.warn('undefined audio node type!!', audioNodeState)
      return null
  }
}

export default AudioBus
