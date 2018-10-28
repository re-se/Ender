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
import { execLambda, isLambda } from '../util/lambda'
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
   */
  img: function*(
    src: string,
    classNames: string | string[],
    effect: string
  ): Generator<void, void, void> {
    store.dispatch(addImage(src, classNames, effect))
    yield
  },

  /**
   * アニメーションする(同期)
   */
  animate: function*(
    selector: string,
    effectName: string
  ): Generator<void, void, void> {
    let animation = new ImageAnimation(selector, effectName, true)
    AnimationUtil.setAnimation(animation)
    animation.start()
    yield
  },

  /**
   * アニメーションする(非同期)
   */
  aanimate: (selector: string, effectName: string) => {
    let animation = new ImageAnimation(selector, effectName)
    AnimationUtil.setAnimation(animation)
    animation.start()
  },

  playAudio: (
    out: string,
    src: string,
    isLoop: boolean,
    loopOffsetTime: number,
    effect: string
  ) => {
    const srcStr = engine.eval(src)
    store.dispatch(
      playAudioAction(
        srcStr,
        engine.eval(out),
        engine.eval(isLoop),
        engine.eval(loopOffsetTime)
      )
    )
    if (effect) {
      store.dispatch(loadAudioEffectAction(src, engine.eval(effect)))
    }
  },

  stopAudio: (targetBus: string, effect: string) => {
    const bus = engine.eval(targetBus)
    if (effect) {
      store.dispatch(
        loadAudioEffectAction(bus, engine.eval(effect), false, () => {
          store.dispatch(stopAudioAction(bus))
        })
      )
    } else {
      store.dispatch(stopAudioAction(bus))
    }
  },

  pauseAudio: (targetBus: string, effect: string) => {
    store.dispatch(
      pauseAudioAction(engine.eval(targetBus), engine.eval(effect))
    )
  },

  loadAudioBus: (name: string, out: string, gain: number) => {
    store.dispatch(
      loadAudioBusAction(engine.eval(name), engine.eval(out), engine.eval(gain))
    )
  },

  effectAudio: (targetBus: string, effect: string) => {
    store.dispatch(loadAudioEffectAction(targetBus, effect, true))
  },

  aeffectAudio: (targetBus: string, effect: string) => {
    store.dispatch(loadAudioEffectAction(targetBus, effect, false))
  },

  movie: function*(
    src: string,
    classNames: string | string[],
    isLoop: boolean
  ): Generator<void, void, void> {
    store.dispatch(addMovie(src, classNames, isLoop))
    yield
  },

  layout: (...componentInsts: FuncInst[]) => {
    store.dispatch(addComponents(componentInsts))
  },

  set: (path: string, value: any) => {
    return engine.setVar(path, value)
  },

  import: (filePath: string) => {
    const path = toAbsolutePath(
      engine.eval(filePath),
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

  wait: function*(value: ?any): Generator<any, void, void> {
    yield value
  },
}

export function* generator(inst: FuncInst): Iterator<any> {
  const lambda = engine.getVar(inst.name, {})
  if (isLambda(lambda)) {
    return execLambda(lambda, inst.args)
  }

  if (!funcMap[inst.name]) {
    console.warn(`undefined func ${inst.name}`)
    return
  }
  if (funcMap[inst.name] instanceof GeneratorFunction) {
    yield* funcMap[inst.name](...inst.args)
  } else {
    return funcMap[inst.name](...inst.args)
  }
}

export function exec(inst: FuncInst): any {
  if (!funcMap[inst.name]) {
    console.warn(`undefined func ${inst.name}`)
    return
  }
  return funcMap[inst.name](...inst.args)
}
