React = require 'react'
path = require 'path'

module.exports = React.createClass
  componentDidMount: ->
  render: ->
    basePath = @props.basePath
    audio = @props.audio
    style = {}
    if @props.config.audio.hasOwnProperty audio.type
       Object.assign style, @props.config.audio[audio.type]
    if audio.option
      style.forIn (key, value) ->
        if audio.option.hasOwnProperty key
          style[key] = audio.option[key]
    onload = (e) =>
      console.log "loading #{audio.name}"
    onloaded = (e) =>
      audioDom = e.currentTarget
      @props.Action.setAudio audio.name, audioDom
      console.log "loaded #{audio.name}"
      @props.Action.engineExec()
    onEndSrcLoop = (e) =>
      audioDom = document.getElementById "audio-#{audio.name}_loop"
      # audioDom.play()
      @props.Action.playAudio "#{audio.name}_loop"
    onEndTimeLoop = (e) =>
      audioDom = e.currentTarget
      audioDom.currentTime = style.loopStart
      audioDom.play()
    src = path.join(basePath, audio.src)
    if style.loop
      if audio.loopSrc?
        <audio src={src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded} onEnded={onEndSrcLoop} onError={@onError}/>
      else if style.loopStart == 0
        <audio src={src} id={"audio-" + audio.name} loop preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded} onError={@onError}/>
      else
        <audio src={src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded} onEnded={onEndTimeLoop} onError={@onError}/>
    else
      <audio src={src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded} onError={@onError}/>

  onError: (e) ->
    @props.Action.engineExec()
