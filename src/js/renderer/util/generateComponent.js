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
 * @return {React.Component}
 */
const generateComponent = (name: string, args: any[], key: string) => {
  const Module = require(componentList[name].path)
  const Component = Module[name] || Module.default
  const component: FuncInst = { type: 'func', name, args }

  let props = ComponentUtil.getProps(component)
  let animationStart = AnimationUtil.generateAnimationStartFunc(
    getAnimations(component)
  )
  return <Component {...props} key={key} refs={animationStart} />
}

export default generateComponent

/**
 * 該当するアニメーションを取得
 * @param  {FuncInst} classNames
 * @return {Animation[]}
 */
const getAnimations = (component: FuncInst): Animation[] => {
  let availableAnimation = []

  for (const animation of store.getState().animation) {
    if (AnimationUtil.isAvailableAnimation(animation, component)) {
      availableAnimation.push(animation)
    }
  }

  return availableAnimation
}
