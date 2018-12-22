//@flow
import { remote } from 'electron'
import { get, has } from 'lodash'
import engine from '../../main/engine'
import store from '../../main/store'

export function snapshot(isSync: boolean = true): void {
  const config = engine.getVar('config')
  const context = {
    state: getSaveState(),
    engine: engine.getContext(),
    text: getLastMessage(),
    thumbnail: null,
  }
  engine.setVar('global.__system__.snapshot', context)

  remote.getCurrentWindow().capturePage(img => {
    engine.setVar(
      'global.__system__.snapshot.thumbnail',
      img.resize({ width: 200 }).toDataURL()
    )
    if (isSync) {
      engine.exec()
    }
  })
}

/**
 * セーブ用の State に書き換える(不要な情報を削除する)
 */
function getSaveState(): Object {
  const state = { ...store.getState() }

  // save は除外
  state.save = {}

  // ループ再生されない音声は除外する
  const deletedAudioBusKeyList = []
  if (has(state, 'audio.audioBuses')) {
    state.audio.audioBuses = { ...state.audio.audioBuses }
    Object.keys(state.audio.audioBuses).forEach(busKey => {
      if (isOnceAudio(state.audio.audioBuses[busKey])) {
        delete state.audio.audioBuses[busKey]
        deletedAudioBusKeyList.push(busKey)
      }
    })
  }

  // 除外した音声に適用していたエフェクトは削除する
  if (has(state, 'audio.audioEffects')) {
    state.audio.audioEffects = [...state.audio.audioEffects]
    state.audio.audioEffects = state.audio.audioEffects.filter(
      audioEffect => !deletedAudioBusKeyList.includes(audioEffect.targetBus)
    )
  }

  return state
}

/**
 * ループしない音声か判定
 */
function isOnceAudio(audioBus): boolean {
  for (let nodeKey in audioBus.nodes) {
    if (
      audioBus.nodes[nodeKey].type === 'source' &&
      !audioBus.nodes[nodeKey].isLoop
    ) {
      return true
    }
  }
  return false
}

/**
 * 直前に表示されていたテキストを取得
 */
function getLastMessage(): string {
  const lines = get(store.getState(), 'MessageBox.history', '').split('\n')
  let lastMessage = ''
  while (lastMessage.length === 0 && lines.length > 0) {
    lastMessage = lines.pop()
  }
  return lastMessage
}
