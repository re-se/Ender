React = require 'react'

module.exports = React.createClass
  componentDidMount: ->
  render: ->
    basePath = @props.config.basePath
    audio = @props.audio
    style = {}
    if @props.config.audio.hasOwnProperty audio.type
       Object.assign style, @props.config.audio[audio.type]
    if audio.option
      style.forIn (key, value) ->
        if audio.option.hasOwnProperty key
          style[key] = audio.option[key]
    onload = (e) =>

    onloaded = (e) =>
      audioDom = e.currentTarget
      @props.Action.setAudio audio.name, audioDom
      console.log "loaded #{audio.name}"
      @props.Action.engineExec()
    onEndSrcLoop = (e) =>
      dom = document.getElementById "audio-#{audio.name}_loop"
      console.log dom
      dom.play()
      @props.Action.playAudio "#{audio.name}_loop"
    onEndTimeLoop = (e) =>
      audioDom = e.currentTarget
      audioDom.currentTime = style.loopStart
      audioDom.play()
    if style.loop
      if audio.loopSrc?
        <audio src={basePath + audio.src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded} onEnded={onEndSrcLoop}/>
      else if style.loopStart == 0
        <audio src={basePath + audio.src} id={"audio-" + audio.name} loop preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded}/>
      else
        <audio src={basePath + audio.src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded} onEnded={onEndTimeLoop}/>
    else
      <audio src={basePath + audio.src} id={"audio-" + audio.name} preload="auto" ref="audio" onLoadStart={onload} onLoadedData={onloaded}/>
