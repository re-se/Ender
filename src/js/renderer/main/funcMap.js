//@flow
import type { FuncInst } from './instMap'
import { addComponents, addImage } from '../actions/actions'
import ImageAnimation from '../util/animation/ImageAnimation'
import AnimationUtil from '../util/AnimationUtil'
import store from './store'
import engine from './engine'
import { toAbsolutePath, GeneratorFunction } from '../util/util'

/**
 * 関数命令の引数を取得する
 * @param {any[]} args
 * @param {number} index
 * @param {any | undefined} defaultValue
 * @return {any | undefined}
 */
export const getFuncArgs = (args: any[], index: number, defaultValue: any) => {
  if (args[index] !== undefined && args[index] !== '') {
    return engine.eval(args[index])
  } else {
    return defaultValue
  }
}

export default {
  /**
   * 画像を描画する
   * args [
   *  1: src        画像のファイルパス
   *  2: classNames クラス名
   *  3: effect     描画時のエフェクト(FadeInなど)
   * ]
   * @param  {any[]} args
   * @return {void}
   */
  img: (args: string[]) => {
    store.dispatch(addImage(args))
  },

  /**
   * アニメーションする(同期)
   * args [
   *  1: selector
   *  2: effectName
   * ]
   * @param  {[string[] | string, string]} args
   * @return {void}
   */
  animate: function*(args: [string[] | string, string]): GeneratorFunction {
    AnimationUtil.setAnimation(new ImageAnimation(args[0], args[1], true))
    yield
  },

  /**
   * アニメーションする(非同期)
   * args [
   *  1: selector
   *  2: effectName
   * ]
   * @param  {string[]} args
   * @return {void}
   */
  aanimate: (args: string[]) => {
    AnimationUtil.setAnimation(new ImageAnimation(args[0], args[1]))
  },

  layout: (args: FuncInst[]) => {
    store.dispatch(addComponents(args))
  },

  set: (args: [string, any]) => {
    engine.setVar(args[0], args[1])
  },

  import: (args: string[]) => {
    const path = toAbsolutePath(
      engine.eval(args[0]),
      engine.getVar('config.basePath')
    )
    const css = require(path)
    store.dispatch(
      addComponents(
        [
          {
            type: 'func',
            name: 'Style',
            args: [css],
          },
        ],
        'style'
      )
    )
  },
}
