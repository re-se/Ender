//@flow
import path from 'path'
import fs from 'fs'
import { get, has } from 'lodash'
import engine from '../../main/engine'
import store from '../../main/store'
import { updateSave } from '../../actions/actions'
import { isExistFile } from '../util'
import { AUTO_SAVE_FILE_NAME, SAVE_EXT_NAME } from './config'

/**
 * ゲームのセーブデータを作成する
 * 作成したセーブデータはファイル書き込みとStateへの反映が行われる
 */
export function save(name: string, screenshot: any): SaveData {
  const config = engine.getVar('config')
  const context: SaveData = {
    name,
    date: new Date(),
    state: getSaveState(),
    engine: engine.getContext(),
    text: getLastMessage(),
    thumbnail: screenshot ? screenshot.toDataURL() : null,
  }

  // セーブフォルダがなければ作成
  const savePath = path.join(config.basePath || '', config.savePath || '')
  if (!isExistFile(savePath)) {
    fs.mkdirSync(savePath)
  }

  // 書き込み予定のセーブファイルがすでにあったら削除
  const saveFilePath = path.join(savePath, name + SAVE_EXT_NAME)
  if (isExistFile(saveFilePath)) {
    fs.unlink(saveFilePath, err => {
      if (err) {
        console.warn(err)
      }
    })
  }

  fs.writeFile(saveFilePath, JSON.stringify(context), err => {
    if (err) {
      console.warn(err)
    } else {
      console.log('done save')
    }
  })

  store.dispatch(updateSave(context))

  return context
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
