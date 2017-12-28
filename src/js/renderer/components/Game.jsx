import React from 'react';
import generateComponent from '../utils/generateComponent';

export type Props = {
  children: ComponentMaterial
};

const Game = ({children}: Props) => {
  <div id="inner" className="inner-view" key="inner-view">
   {generateComponent(children)}
  </div>
}

export default Game;
