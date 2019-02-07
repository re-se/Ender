//@flow
import fs from 'fs'
import { get } from 'lodash'
import type { FuncInst } from './instMap'
import {
  resetState,
  addComponents,
  deleteComponents,
  deleteStyle,
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
import { autoPlay } from '../util/autoPlay'
import { execLambda, isLambda } from '../util/lambda'
import ComponentUtil from '../util/ComponentUtil'
import StyleUtil from '../util/StyleUtil'
import { save, deleteSave, snapshot } from '../util/save'
import { saveConfig as _saveConfig } from '../main/config'

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
    store.dispatch(
      addImage(engine.eval(src), engine.eval(classNames), engine.eval(effect))
    )
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
    animation.start()
    AnimationUtil.setAnimation(animation)
    yield
  },

  /**
   * アニメーションする(非同期)
   */
  aanimate: (selector: string, effectName: string) => {
    let animation = new ImageAnimation(selector, effectName)
    animation.start()
    AnimationUtil.setAnimation(animation)
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
            args: [css, filePath],
          },
        ],
        'style'
      )
    )
  },

  wait: function*(value: ?any): Generator<any, void, void> {
    autoPlay()
    yield value
  },

  /**
   * args
   *  0: name
   */
  save: (name: string) => {
    save(engine.eval(name), engine.getVar('global.__system__.snapshot'))
  },

  /**
   * args
   *  0: name
   */
  deleteSave: (name: string) => {
    deleteSave(engine.eval(name))
  },

  /**
   * args
   *  0: name
   */
  loadSaveData: (nameExpr: string | Object) => {
    const name = engine.eval(nameExpr)
    const saveData = get(store.getState(), `save.${name}`)
    console.log(saveData)
    if (saveData) {
      engine.loadSaveData(saveData)
    }
  },

  snapshot: function*(): GeneratorFunction {
    snapshot()
    yield
  },

  /**
   * args
   *  0: script
   */
  include: (script: string) => {
    engine.includeScript(script)
  },

  screen: (script: string) => {
    engine.includeScreen(script)
  },

  /**
   * args
   *  0: script
   */
  load: (script: string) => {
    store.dispatch(resetState())
    engine.loadScript(script)
  },

  clear: (name: string, effect) => {
    if (name) {
      const selectorTree = StyleUtil.parse(name)
      store.dispatch(deleteComponents(selectorTree))
    } else {
      store.dispatch(resetState())
    }

    if (effect) {
      store.dispatch(
        effect(bus, engine.eval(effect), false, () => {
          store.dispatch(stopAudioAction(bus))
        })
      )
    } else {
      store.dispatch(stopAudioAction(bus))
    }
  },

  clearStyle: (filePath: string) => {
    store.dispatch(deleteStyle(filePath))
  },

  saveConfig: () => {
    _saveConfig(engine.getVar('config'))
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
