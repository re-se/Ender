//@flow
import Animation from './Animation'
import store from '../../main/store'
import { AnimationLibrary } from './library/AnimationLibrary'
import Animejs from './library/Animejs'
import engine from '../../main/engine'

export default class ImageAnimation extends Animation {
  /**
   * エフェクト名 ./image 配下にあるアニメーションのファイル名を指す
   * @type {string}
   */
  effectName: string

  /**
   * エフェクト名に対応したアニメーション
   */
  animation: AnimationLibrary

  /**
   * 非同期アニメーションか
   * @type {boolean}
   */
  isSync: boolean

  constructor(
    selector: string | string[],
    effectName: string,
    isSync: boolean = false
  ) {
    super(selector)
    this.effectName = effectName
    const setting = require(`./image/${effectName}`).default
    this.animation = new Animejs(this, setting)
    this.isSync = isSync
  }

  start() {
    // アニメーション開始
    this.animation.start()

    // アニメオブジェクトを開始状態にする
    this.isStarted = true
  }

  finish() {
    // アニメーションを止める
    this.animation.finish()

    // アニメオブジェクトを終了状態にする
    this.isFinished = true

    if (this.isSync) {
      engine.exec()
    }
  }

  onExec() {
    this.finish()
  }
}
