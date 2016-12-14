React = require 'react'

module.exports = React.createClass
  componentDidMount: ->
  render: ->
    basePath = "resource/"
    audio = @props.audio
    style = {}
    if @props.config.hasOwnProperty audio.type
       Object.assign style, @props.config[audio.type]
    if audio.option
      style.forIn (key, value) ->
        if audio.option.hasOwnProperty key
          style[key] = audio.option[key]
    onload = (e) =>
      audioDom = e.currentTarget
      src = @props.audioContext.createMediaElementSource audioDom
      if e.id is "@audio-" + audio.name
        @props.Action.setAudio audio.name, src
      else
        @props.Action.setAudio "#{audio.name}", src
    onloaded = () ->
      console.log "loaded #{audio.name}"
    onend = (e) =>
      audioDom = e.currentTarget
      audioDom.currentTime = style.loopStart
      audioDom.play()
      # dom = document.getElementById "audio-#{audio.name}@"
      # console.log dom
      # dom.play()
      # console.log @props.Action.playAudio
      # @props.Action.playAudio "#{audio.name}@"
    if style.loop
      if style.loopStart == 0
        <audio src={basePath + audio.src} id={"audio-" + audio.name} loop preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded}/>
      else
        <audio src={basePath + audio.src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded} onEnded={onend}/>
    else
      <audio src={basePath + audio.src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded}/>
