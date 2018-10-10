//@flow
import type { FuncInst } from './instMap'
import {
  addComponents,
  addImage,
  addMovie,
  playAudio as playAudioAction,
  stopAudio as stopAudioAction,
  pauseAudio as pauseAudioAction,
  loadAudioBus as loadAudioBusAction,
  loadAudioEffect as loadAudioEffectAction,
} from '../actions/actions'
import ImageAnimation from '../util/animation/ImageAnimation'
import MovieAnimation from '../util/animation/MovieAnimation'
import AnimationUtil from '../util/AnimationUtil'
import store from './store'
import engine from './engine'
import { toAbsolutePath, GeneratorFunction } from '../util/util'
import ComponentUtil from '../util/ComponentUtil'

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

export const funcMap = {
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
    const src = engine.eval(args[1])
    store.dispatch(
      playAudioAction(
        src,
        engine.eval(args[0]),
        engine.eval(args[2]),
        engine.eval(args[3])
      )
    )
    if (args[4]) {
      store.dispatch(loadAudioEffectAction(src, engine.eval(args[4])))
    }
  },

  stopAudio: (args: [string, string]) => {
    const bus = engine.eval(args[0])
    if (args[1]) {
      store.dispatch(
        loadAudioEffectAction(bus, engine.eval(args[1]), false, () => {
          store.dispatch(stopAudioAction(bus))
        })
      )
    } else {
      store.dispatch(stopAudioAction(bus))
    }
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

  /**
   * args [
   *  0: targetBus
   *  1: effect
   * ]
   */
  effectAudio: (args: string[]) => {
    store.dispatch(loadAudioEffectAction(args[0], args[1], true))
  },

  /**
   * args [
   *  0: targetBus
   *  1: effect
   * ]
   */
  aeffectAudio: (args: string[]) => {
    store.dispatch(loadAudioEffectAction(args[0], args[1], false))
  },

  /**
   * args
   *  0: src
   *  1: classNames
   *  2: isLoop
   */
  movie: function*(args: any[]): GeneratorFunction {
    const id = ComponentUtil.generateId('movie')
    const animation = new MovieAnimation(id, true)

    args[3] = id
    args[4] = () => {
      animation.finish()
    }

    store.dispatch(addMovie(args))

    AnimationUtil.setAnimation(animation)
    animation.start()
    yield
  },

  layout: (args: FuncInst[]) => {
    store.dispatch(addComponents(args))
  },

  set: (args: [string, any]) => {
    return engine.setVar(args[0], args[1])
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

export function* generator(inst: FuncInst): Iterator<any> {
  if (!funcMap[inst.name]) {
    console.warn(`undefined func ${inst.name}`)
    return
  }
  if (funcMap[inst.name] instanceof GeneratorFunction) {
    yield* funcMap[inst.name](inst.args)
  } else {
    return funcMap[inst.name](inst.args)
  }
}

export function exec(inst: FuncInst): any {
  if (!funcMap[inst.name]) {
    console.warn(`undefined func ${inst.name}`)
    return
  }
  return funcMap[inst.name](inst.args)
}
