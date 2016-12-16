React = require 'react'
Audio = require './Audio'

module.exports = React.createClass
  render: ->
    items = @props.audios.forIn (key, audio) =>
      <Audio audio={audio} key={audio.src} config={@props.config}
        Action={
          "setAudio": @props.Action.setAudio,
          "playAudio": @props.Action.playAudio
        }
      />
    <div className="audios">
      {items}
    </div>
