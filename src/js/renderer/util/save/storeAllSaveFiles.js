//@flow
import path from 'path'
import fs from 'fs'
import engine from '../../main/engine'
import store from '../../main/store'
import { updateSave, deleteSave } from '../../actions/actions'
import { isExistFile } from '../util'
import { SAVE_EXT_NAME } from './config'

/**
 * セーブフォルダ内にあるセーブファイルの情報で State を更新する
 */
export function storeAllSaveFiles(): void {
  const config = engine.getVar('config')

  const savePath = path.join(config.savePath || '')

  // セーブディレクトリがなければ作る
  if (!isExistFile(savePath)) {
    fs.mkdirSync(savePath)
  }

  const filenames = fs
    .readdirSync(savePath)
    .filter(filename => path.extname(filename) === SAVE_EXT_NAME)

  // State にセーブファイルの情報を登録
  filenames.forEach(filename => {
    const file = fs.readFileSync(path.join(savePath, filename), 'utf-8')
    let context = JSON.parse(file)
    context = formatSaveData(context)

    store.dispatch(updateSave(context))
  })

  // セーブファイルのリストにない State は削除
  const names = filenames.map(filename =>
    filename.slice(0, -SAVE_EXT_NAME.length)
  )
  const saveState = store.getState().save || {}
  for (let key in saveState) {
    const name = saveState[key].name
    if (!names.includes(name)) {
      store.dispatch(deleteSave(name))
    }
  }
}

function formatSaveData(saveData: Object): Object {
  let formatedSaveData = { ...saveData }
  if (saveData.date) {
    formatedSaveData.date = new Date(saveData.date)
  }
  return formatedSaveData
}
