React = require 'react'
Audio = require './Audio'

module.exports = React.createClass
  render: ->
    items = @props.audios.forIn (key, audio) =>
      <Audio audio={audio} key={audio.src} config={@props.config} basePath={@props.basePath} Action={@props.Action}
      />
    <div className="audios">
      {items}
    </div>
