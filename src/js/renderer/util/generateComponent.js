//@flow
import React from 'react'
import componentList from '../config/componentList'

/**
 * React コンポーネントのインスタンスを生成する
 * @return {React.Component}
 */
const generateComponent = (name: string, args: any[]) => {
  const Component = require(componentList[name].path).default
  let props = {}
  if (args) {
    componentList[name].args.forEach((key, i) => {
      props[key] = args[i]
    })
  }
  return <Component {...props} />
}

export default generateComponent
