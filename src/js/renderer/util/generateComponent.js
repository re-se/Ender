//@flow
import React from 'react'
import componentList from '../config/componentList'
import store from '../main/store'
import Animation from './animation/Animation'

/**
 * React コンポーネントのインスタンスを生成する
 * @return {React.Component}
 */
const generateComponent = (name: string, args: any[], key: string) => {
  const Module = require(componentList[name].path)
  const Component = Module[name] || Module.default
  let props = {}
  if (args) {
    props = componentList[name].getProps(args)
  }
  let animationStart = generateAnimationStartFunc(
    getAnimations(props.classNames)
  )
  return <Component {...props} key={key} refs={animationStart} />
}

export default generateComponent

/**
 * アニメーションを開始するコールバック関数を生成
 * @param  {Animation[]} animations
 * @return {()=>void)}
 */
const generateAnimationStartFunc = (animations: Animation[]) => {
  return () => {
    for (let animation of animations) {
      // アニメーションに初期値があったらエレメントスタイルに初期値をさす
      if (animation.startStyle) {
        //TODO:指定コンポーネントのStateにスタイル差す方法
      }
      // 多重起動防止
      if (!animation.isStarted) {
        animation.start()
      }
    }
  }
}

/**
 * 該当するアニメーションを取得
 * @param  {string[]} classNames
 * @return {Animation[]}
 */
const getAnimations = (classNames: string[]) => {
  let availableAnimation = []

  for (const animation of store.getState().animation) {
    if (isAvailableAnimation(classNames, animation)) {
      availableAnimation.push(animation)
    }
  }

  return availableAnimation
}

/**
 * アニメーションの対象になるか判定
 * @param  {string[]}  classNames
 * @param  {Animation}  animation
 * @return {Boolean}
 */
const isAvailableAnimation = (classNames: string[], animation: Animation) => {
  if (!animation.isFinished) {
    return false
  }
  for (const selectorClassName of animation.selectorClassNames) {
    if (!classNames.includes(selectorClassName)) {
      return false
    }
  }
  return true
}
