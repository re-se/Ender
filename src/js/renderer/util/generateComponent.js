//@flow
import React from 'react'
import componentList from '../config/componentList'

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
  return <Component {...props} key={key} />
}

export default generateComponent
