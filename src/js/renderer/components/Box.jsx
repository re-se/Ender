import React from 'react';
import generateComponent from '../utils/generateComponent';

export type Props = {
  children: ComponentMaterial
};

const Box = ({classList, children}: Props) => {
  <div className="ender-box ${classList.join(' ')}">
   {generateComponent(children)}
  </div>
}

export default Box;
