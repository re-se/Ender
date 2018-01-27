// @flow

const React = require('react')
const path = require('path')

type Props = {
  image: Image,
  basePath: string,
}

export default class ImageCell extends React.Component<void, Props, void> {
  props: Props
  constructor(props: Props) {
    super(props)
  }
  render() {
    const image = this.props.image
    let cl = image.className
    if (!cl) {
      cl = 'image-default'
    }
    return (
      <img
        src={path.join(this.props.basePath, image.src)}
        className={cl}
        id={image.src}
        onLoad={image.callback}
        onError={image.callback}
      />
    )
  }
}
