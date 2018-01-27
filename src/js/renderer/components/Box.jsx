import React from 'react'
import generateComponent from '../util/generateComponent'

export type Props = {
  children: ComponentMaterial,
}

const Box = ({ classNames = [], children = [] }: Props) => {
  let childComponents = []
  for (const key in children) {
    const child = children[key]
    childComponents.push(generateComponent(child.name, child.args, key))
  }

  return (
    <div className={`ender-box ${classNames.join(' ')}`}>{childComponents}</div>
  )
}

export default Box
