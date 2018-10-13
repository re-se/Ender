import path from 'path'
import fs from 'fs'
import { has } from 'lodash'
import engine from '../main/engine'
import store from '../main/store'

const AUTO_SAVE_FILE_NAME = 'autosave'

export function save(name: string, screenshot) {
  const config = engine.getVar('config')
  const now = new Date()
  const context = {
    name,
    date: now,
    state: getSaveState(),
    engine: engine.getContext(),
    thumbnail: screenshot ? screenshot.toDataURL() : null,
  }

  // セーブフォルダがなければ作成
  const savePath = path.join(config.basePath || '', config.savePath || '')
  if (!isExistFile(savePath)) {
    fs.mkdirSync(savePath)
  }

  // 書き込み予定のセーブファイルがすでに合ったら削除
  const saveFilePath = path.join(savePath, `${name}\.SAVE`)
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
  return context
}

function isExistFile(filePath: string): boolean {
  try {
    fs.statSync(filePath)
    return true
  } catch (error) {
    return false
  }
}

function getSaveState(): State {
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
