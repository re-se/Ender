//@flow
import React from 'react'
import componentList from '../config/componentList'
import store from '../main/store'
import Animation from './animation/Animation'
import ComponentUtil from './ComponentUtil'
import AnimationUtil from './AnimationUtil'
import type { FuncInst } from '../main/instMap'

/**
 * React コンポーネントのインスタンスを生成する
 * @param {ComponentState} component
 * @return {React.Component}
 */
const generateComponent = (component: ComponentState) => {
  const Module = require(componentList[component.name].path)
  const Component = Module[component.name] || Module.default

  console.log(component, store.getState())

  let animationStart = AnimationUtil.generateAnimationStartFunc(
    getAnimations(component)
  )
  return (
    <Component {...component.props} key={component.key} refs={animationStart} />
  )
}

export default generateComponent

/**
 * 該当するアニメーションを取得
 * @param  {ComponentState} classNames
 * @return {Animation[]}
 */
const getAnimations = (component: ComponentState): Animation[] => {
  let availableAnimation = []

  for (const animation of store.getState().animation) {
    if (AnimationUtil.isAvailableAnimation(animation, component)) {
      availableAnimation.push(animation)
    }
  }

  return availableAnimation
}
