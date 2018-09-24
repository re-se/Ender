//@flow
import type { FuncInst } from './instMap'
import {
  addComponents,
  addImage,
  playAudio as playAudioAction,
  stopAudio as stopAudioAction,
  pauseAudio as pauseAudioAction,
  loadAudioBus as loadAudioBusAction,
} from '../actions/actions'
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
  img: function*(args: string[]): GeneratorFunction {
    store.dispatch(addImage(args))
    yield
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
    let animation = new ImageAnimation(
      engine.eval(args[0]),
      engine.eval(args[1]),
      true
    )
    AnimationUtil.setAnimation(animation)
    animation.start()
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
    let animation = new ImageAnimation(
      engine.eval(args[0]),
      engine.eval(args[1])
    )
    AnimationUtil.setAnimation(animation)
    animation.start()
  },

  /**
   * args [
   *  0: out
   *  1: src
   *  2: isLoop
   *  3: loopOffsetTime
   *  4: effect
   * ]
   */
  playAudio: (args: string[]) => {
    store.dispatch(
      playAudioAction(
        engine.eval(args[1]),
        engine.eval(args[0]),
        engine.eval(args[2]),
        engine.eval(args[3]),
        engine.eval(args[4])
      )
    )
  },

  stopAudio: (args: [string, string]) => {
    store.dispatch(stopAudioAction(engine.eval(args[0]), engine.eval(args[1])))
  },

  pauseAudio: (args: [string, string]) => {
    store.dispatch(pauseAudioAction(engine.eval(args[0]), engine.eval(args[1])))
  },

  /**
   * args [
   *  0: name
   *  1: out
   *  2: gain
   * ]
   */
  loadAudioBus: (args: [string, string, string]) => {
    store.dispatch(
      loadAudioBusAction(
        engine.eval(args[0]),
        engine.eval(args[1]),
        engine.eval(args[2])
      )
    )
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

  wait: function*(args?: any[]): GeneratorFunction {
    yield args ? args[0] : undefined
  },
}
