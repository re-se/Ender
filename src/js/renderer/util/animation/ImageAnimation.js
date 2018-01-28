//@flow
import Animation from './Animation'
import store from '../../main/store'
import { updateComponentStyle } from '../../actions/actions'
import { AnimationLibrary } from './library/AnimationLibrary'
import Animejs from './library/Animejs'
import StyleUtil from '../StyleUtil'

/**
 * アニメーションファイル(./image 配下)が返却する情報の型
 */
export type AnimationStyle = {
  endStyle: Object,
  animeController: any,
}

/**
 * 外部アニメーションライブラリを扱うラッパー
 * ここに代入するライブラリが使用される
 * @type {AnimetionLibrary}
 */
const animeLibrary: AnimationLibrary = new Animejs()

export default class ImageAnimation extends Animation {
  /**
   * エフェクト名 ./image 配下にあるアニメーションのファイル名を指す
   * @type {string}
   */
  effectName: string
  /**
   * エフェクト名に対応したアニメーションを生成する関数
   * @param  {string} エフェクト名
   * @return {AnimationStyle}
   */
  animation: (string, () => void) => AnimationStyle
  /**
   * アニメーション終了時点でのスタイル
   * @type {any}
   */
  endStyle: any
  /**
   * アニメーションライブラリを操作するコントローラー
   * @type {any}
   */
  animationController: any

  constructor(selector: string, effectName: string) {
    super(selector)
    this.effectName = effectName
    this.animation = require(`./image/${effectName}`).default
  }

  start() {
    // アニメーションを作成
    const animationStyle = this.animation(
      StyleUtil.toString(this.selectorTree),
      () => {
        this.finish()
      }
    )

    // アニメオブジェクトに終了状態とコントローラーを保持
    this.endStyle = animationStyle.endStyle
    this.animationController = animationStyle.animeController

    // アニメーション開始
    animeLibrary.start(this)

    // アニメオブジェクトを開始状態にする
    this.isStarted = true
  }

  finish() {
    // アニメーションを止める
    animeLibrary.finish(this)

    // アニメオブジェクトを終了状態にする
    this.isFinished = true

    // アニメーション対象のコンポーネントに終了状態のスタイルをさす
    store.dispatch(updateComponentStyle(this.selectorTree, this.endStyle))
  }

  onExec() {
    this.finish()
  }
}
