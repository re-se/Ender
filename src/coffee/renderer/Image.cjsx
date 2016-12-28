React = require 'react'
path = require 'path'

module.exports = React.createClass
  componentDidMount: ->
  render: ->
    image = @props.image
    cl = image.className
    cl = "image-default" unless cl
    <img src={path.join @props.basePath, image.src} className={cl} id={image.src}/>
