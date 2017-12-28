import React from 'react';

export type Props = {
  classList: string[],
  path: string,
  loadCallback: ()->void
};

const Image = ({classList, path, loadCallback}: Props) => (
  <img className="ender-image {(classList.length > 0)? classList.join(' ') : 'image-default'}" src={path} onLoad={loadCallback} onError={loadCallback}/>
);

export default Image;
