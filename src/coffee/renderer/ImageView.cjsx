React = require 'react'
Image = require './Image'

module.exports = React.createClass
  render: ->
    counts = {}
    items = @props.images.map (image) =>
      if counts[image.src]?
        counts[image.src] += 1
      else
        counts[image.src] = 0
      <Image image={image} key="#{image.src}-#{counts[image.src]}"/>
    <div className="images">
        {items}
    </div>
