// @flow

import React from 'react'
import ImageCell from './ImageCell'

type Props = {
  images: any,
  style: string,
  basePath: string,
}

export default class ImageView extends React.Component<void, Props, void> {
  props: Props
  constructor(props: Props) {
    super(props)
  }

  render() {
    let items = []
    for (const key in this.props.images) {
      const value = this.props.images[key]
      const item = value.map((image: Image) => {
        return (
          <ImageCell
            basePath={this.props.basePath}
            image={image}
            key={`${image.className}-${image.src}`}
          />
        )
      })
      items.push(item)
    }
    return (
      <div className="images" style={this.props.style}>
        {items}
      </div>
    )
  }
}

module.exports = ImageView // for app
