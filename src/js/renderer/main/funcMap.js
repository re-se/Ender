//@flow
import fs from 'fs'
import { get } from 'lodash'
import type { FuncInst } from './instMap'
import {
  resetState,
  addComponents,
  addImage,
  addMovie,
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
import { save, deleteSave, snapshot } from '../util/save'

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

  /**
   * args
   *  0: script
   */
  load: (script: string) => {
    store.dispatch(resetState())
    engine.loadScript(script)
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
