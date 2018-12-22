//@flow
import path from 'path'
import fs from 'fs'
import engine from '../../main/engine'
import store from '../../main/store'
import { updateSave } from '../../actions/actions'
import { isExistFile } from '../util'
import { SAVE_EXT_NAME } from './config'

/**
 * ゲームのセーブデータを作成する
 * 作成したセーブデータはファイル書き込みとStateへの反映が行われる
 */
export function save(name: string): SaveData {
  const config = engine.getVar('config')
  const snapshot = engine.getVar('global.__system__.snapshot')

  const context: SaveData = {
    name,
    date: new Date(),
    ...snapshot,
  }

  console.log(context)

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
