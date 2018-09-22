import uuid from 'uuid/v1'

export function generateAudioNodeKey(audioNodeState) {
  return 'audio_node_' + audioNodeState.type + uuid()
}
