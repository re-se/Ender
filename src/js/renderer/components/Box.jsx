import React from 'react'
import generateComponent from '../util/generateComponent'

export type Props = {
  children: ComponentMaterial
};

const Box = ({children = []}: Props) => {
  let classNames = []
  if (typeof children[0] === 'string' || children[0] instanceof Array) {
    classNames.concat(children[0])
    children = children.slice(1)
  }
  let childComponents = []
  for (const key in children) {
    const child = children[key]
    childComponents.push(generateComponent(child.name, child.args, key))
  }

  return (
    <div className={`ender-box ${classNames.join(' ')}`}>
      { childComponents }
    </div>
  )
}

export default Box
