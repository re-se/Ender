React = require 'react'

module.exports = React.createClass
  componentDidMount: ->
  render: ->
    basePath = "resource/"
    image = @props.image
    cl = image.className
    cl = "image-default" unless cl
    <img src={basePath + image.src} className={cl} ref="image"/>
