React = require 'react'
Image = require './Image'

module.exports = React.createClass
  render: ->
    counts = {}
    items = []
    for key, value of @props.images
      items.push value.map (image) =>
        if counts[image.src]?
          counts[image.src] += 1
        else
          counts[image.src] = 0
        <Image basePath={@props.basePath} image={image} key="#{image.src}-#{counts[image.src]}"/>
    <div className="images" style={@props.style}>
        {items}
    </div>
