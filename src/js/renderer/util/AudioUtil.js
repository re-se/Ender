import store from '../main/store'

export default class AudioUtil {
  /**
   * Stateから該当のAudioを検索してindexを返す
   */
  static getIndex(audio) {
    const audioStates = store.getState().audio

    for (const index in audioStates) {
      let audioState = audioStates[index]
      if (audioState.type === audio.type && audioState.src === audio.src) {
        return index
      }
    }

    return -1
  }
}
