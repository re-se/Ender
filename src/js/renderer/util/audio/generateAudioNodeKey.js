import uuid from 'uuid/v1'

export function generateAudioNodeKey(type) {
  return 'audio_node_' + type + uuid()
}
