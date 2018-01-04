import React from 'react'

export type Props = {
  classList: string[],
  source: string,
  loadCallback: ()=>void
}

const Image = ({classNames = [], source = '', loadCallback = () => {}}: Props) => (
  <img className="ender-image {classNames.join(' ') : 'image-default'}" src={source} onLoad={loadCallback} onError={loadCallback}/>
)

export default Image
