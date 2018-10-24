//@flow
import type { FuncInst } from './instMap'
import { addComponents, addImage, addMovie } from '../actions/actions'
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

  movie: function*(
    src: string,
    classNames: string | string[],
    isLoop: boolean
  ): Generator<void, void, void> {
    const id = ComponentUtil.generateId('movie')
    const animation = new MovieAnimation(id, true)
    const onComplete = () => {
      animation.finish()
    }

    store.dispatch(addMovie(src, classNames, isLoop, id, onComplete))

    AnimationUtil.setAnimation(animation)
    animation.start()
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
