import React from 'react'
import generateComponent from '../util/generateComponent'

export type Props = {
  children: ComponentMaterial
};

const Box = ({classList, children}: Props) => {
  if (typeof classList === 'string') {
    classList = [classList]
  }
  return (
    <div className={`ender-box ${classList.join(' ')}`}>
    </div>
  )
}

export default Box
