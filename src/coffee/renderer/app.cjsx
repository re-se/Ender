window.onload = () ->
  React = require 'react'
  ReactDOM = require 'react-dom'
  fs = require 'fs'
  path = require 'path'
  {ipcRenderer, remote} = require 'electron'
  update = require 'react-addons-update'
  Engine = require './js/renderer/engine'
  {Button} = require './js/renderer/Button'
  MessageBox = require './js/renderer/MessageBox'
  NameBox = require './js/renderer/NameBox'
  ImageView = require './js/renderer/ImageView'
  HistoryView = require './js/renderer/HistoryView'
  {SaveView} = require './js/renderer/SaveView'
  Setting = require './js/renderer/Setting'
  Audios = require './js/renderer/Audios'
  Title = require './js/renderer/Title'
  effects = require './js/renderer/effects'
  {Config} = require './js/renderer/Config'
  configPath = 'dist/resource/config.json'
  utils = require './js/renderer/utils'
  utils.load()

  Contents = React.createClass
    getInitialState: ->
      mode: "title"
      message: null
      images: {}
      audios: {}
      refs: {}
      tls: null
      saves: []
    componentWillMount: ->
      config = JSON.parse fs.readFileSync(configPath, 'utf8')
      @config = new Config config
      @config.auto = false
      @audioContext = new AudioContext()
      @gainNodes = {}
      @loadGainNodes()
      @loadSaveFiles()
    componentDidMount: ->
      console.log "start!"
      @prevMode = @state.mode
      # config = JSON.parse fs.readFileSync('dist/resource/config.json', 'utf8')
      # @config = new Config config
      window.addEventListener("keydown", @onKeyDown)
      window.addEventListener("wheel", @onScroll)
      ipcRenderer.on 'show-setting', =>
        @changeToSettingMode()
      Action = {@setText, @setName, @setImage, @clearImage, @clear, @startAnimation, @setConfig, @loadAudio, @playAudio, @stopAudio, @pauseAudio}
      @engine = new Engine(Action, @config)
      # @setState config: config, @engine.exec
      @engine.exec()
    componentWillUnmount: ->
      window.removeEventListener("keydown", @onKeyDown)
      window.removeEventListener("scroll", @onScroll)

    loadSaveFiles: ->
      if @config.savePath?
        filenames = fs.readdirSync @config.savePath
        saves = []
        for filename in filenames
          if path.extname(filename) is ".SAVE"
            file = fs.readFileSync path.join(@config.savePath, filename), 'utf-8'
            saves.push JSON.parse(file)
        @setState saves: saves

    loadGainNodes: ->
      @config.volume.forIn (key, node) =>
        if key isnt "_origin" and key isnt "config" and key isnt "_config"
          @gainNodes[key] = @audioContext.createGain()
          @gainNodes[key].gain.value = node / 100.0
      @config.volume.forIn (key, node) =>
        if key isnt "_origin" and key isnt "config" and key isnt "_config"
          con = if key is "Master" then @audioContext.destination else @gainNodes["Master"]
          @gainNodes[key].connect con

    changeMode: (mode) ->
      unless mode is "main"
        @setConfig "auto", false
      @prevMode = @state.mode
      @setState mode: mode
    Pause: ->
      @setConfig "auto", false

    startAnimation: (target, effectName, callback) ->
      @tls = []
      @engine.startAnimation()
      if typeof target isnt "string"
        cb = =>
          @engine.finishAnimation()
          effectName?()
        return cb() if @state.mode isnt "main" || @config.skip
        node = document.getElementById(target.src)
        @tls.push effects[target.effect](node, cb)
      else
        cb = =>
          @engine.finishAnimation()
          callback?()
        return cb() if @state.mode isnt "main" || @config.skip
        nodes = document.querySelectorAll target
        nodes = document.getElementsByClassName(target) if nodes.length < 1
        for node in nodes
          @tls.push effects[effectName](node, cb)
          cb = null
    finishAnimation: (className) ->
      for tl in @tls
        tl.progress(1, false)
      @tls = null
      @engine.finishAnimation()
    setText: (message, cb) ->
      @setState message: message
      , cb
    setName: (name) ->
      @setState name: name
    setImage: (image) ->
      console.dir @state.images
      fdiff = {}
      fdiff[image.className] = "$set": [image]
      arr = @state.images[image.className]
      if arr?
        arr = arr.concat image
        cb = =>
          @setState
            images: update(@state.images, fdiff)
            , @engine.exec
      else
        arr = [image]
        cb = @engine.exec
      diff = {}
      diff[image.className] = "$set": arr
      if image.effect?
        callback = => @startAnimation(image, cb)
      else
        callback = => cb()
      @setState
        images: update(@state.images, diff)
        , callback
    #target: className(string), effect: name(string)
    clearImage: (target, effect) ->
      diff = {}
      diff[target] = "$set": []
      cb = =>
        @setState
          images: update(@state.images, diff)
          , @engine.exec
      if effect?
        @startAnimation(target, effect, cb)
      else
        cb()
    loadAudio: (audio) ->
      # merge audio style, Config(default) style and Option style
      style = if @config.audio.hasOwnProperty audio.type then @config.audio[audio.type] else {}
      if audio.option
        style.forIn (key, value) ->
          if audio.option.hasOwnProperty key
            style[key] = audio.option[key]
      newAudios = {}
      newAudios[audio.name] = audio
      newAudios = update @state.audios,
       "$merge": newAudios
      @setState audios: newAudios
      if style.loop && audio.loopSrc?
        loopAudio =
          "type": audio.type,
          "name": "#{audio.name}_loop",
          "src": "#{audio.loopSrc}"
          "loopSrc": null
          "option": if audio.option? then audio.option else {}
      else
        null
    setAudioNode: (name, dom) ->
      if @state.audios[name]?
        node = @audioContext.createMediaElementSource dom
        @state.audios[name].node = node
    playAudio: (name) ->
      if @state.audios[name]?
        if @state.audios[name].node?
          style = {}
          if @config.audio.hasOwnProperty @state.audios[name].type
             Object.assign style, @config.audio[@state.audios[name].type]
          if @state.audios[name].option
            style.forIn (key, value) ->
              if @state.audios[name].option.hasOwnProperty key
                style[key] = @state.audios[name].option[key]
          gain = @gainNodes[style.amp]
          @state.audios[name].node?.connect if gain? then gain else @audioContext.destination
          (document.getElementById "audio-#{name}").play()
        else
          console.error "@state.audios[name].node is undefined"
    stopAudio: (name) ->
      if @state.audios[name]?
        audioDom = document.getElementById "audio-#{name}"
        console.log audioDom
        audioDom.pause()
        audioDom.currentTime = 0
    pauseAudio: (name) ->
      if @state.audios[name]?
        (document.getElementById "audio-#{name}").pause()
    refreshGain: ->
      @gainNodes.forIn (key, value) =>
        @gainNodes[key].gain.value = @config.volume[key] / 100

    changeToSettingMode: (e) ->
      e?.stopPropagation()
      if @engine.isAnimated
        @finishAnimation()
      if @engine.isTextAnimated
        @engine.exec()
      @changeMode("setting")

    changeToSaveMode: (e) ->
      e.stopPropagation()
      # rect =
      #   x: 0
      #   y: 0
      #   width: 100
      #   height: 100
      remote.getCurrentWindow().capturePage (img) =>
        @screenshot = img
        @changeMode("save")

    save: (target) ->
      if @state.saves[target]?
        fs.unlink path.join(@config.savePath, @state.saves[target].self), (err) ->
          console.log err
      s = {}
      s.date = new Date()
      arr = @engine?.history.split("\n")
      loop
        s.text = arr.pop()
        break if s.text.length > 0 or arr.length < 1
      s.thumbnail = @screenshot?.toDataURL()
      [s.filename, s.pc] = @engine.getCurrentState()
      s.self = "#{s.date.format()}.SAVE"

      diff = []
      diff[target] = $set: s
      newSaves = update @state.saves, diff
      @setState saves: newSaves
      fs.writeFile path.join(@config.savePath, s.self), JSON.stringify(s)
    load: (target) ->
      save = @state.saves[target]
      if save?
        @engine.setCurrentState save.filename, save.pc, =>
          @changeMode "main"

    clear: (type) ->
      s = switch type
        when "text"
          message: null
        else
          cb = ()=>
            type()
          message: null
          images: {}
          audios: {}
      @setState s, cb

    setConfig: (key, value, save) ->
      unless value? && (@config[key] is value)
        if value?
          @config[key] = value
        else
          json = key
          for key, value of json
            @config[key] = value
        @engine?.config = @config
        if save
          fs.writeFile configPath, @config.toString("  ")
      @refreshGain()
      @autoExec()
      # config = update(@state.config, diff)
      # @engine?.config = config
      # @setState config: config, => @autoExec()
    onClick: (e) ->
      switch @state.mode
        when "main"
          if @state.history?
            @setState history: null
          else
            diff = {}
            diff.auto = $set: false
            @setConfig "auto", false
            if @engine.isAnimated and @tls?
              @finishAnimation()
            else
              @engine?.exec()
    onKeyDown: (e) ->
      switch @state.mode
        when "main"
          @onClick() if e.keyCode is 13
        else
          @changeMode "main" if e.keyCode is 27
    onScroll: (e) ->
      switch @state.mode
        when "main"
          if e.deltaY < 0 and !@state.history?
            diff = {}
            diff.auto = $set: false
            @setConfig "auto", false
            @setState history: @engine?.history
    autoExec: ->
      @engine.autoExec()
    render: () ->
      items = []
      switch @state.mode
        when "main"
          if @state.name?
            items.push <NameBox key="name" name={@state.name} />
          if @state.history?
            items.push <HistoryView key="history" history={@state.history} />
          if @state.message?.length > 0 && !@config.hideMessageBox
            items.push <MessageBox key="message" styles={@config.text.styles} message={@state.message}/>
          imagePath = [@config.basePath]
          imagePath.push @config.image.path if @config.image?.path?
          imagePath = path.join.apply @, imagePath
          items.push <ImageView key="images" images={@state.images} basePath={imagePath} />
          items.push <div className="toolbar">
            <Button key="save-button" inner="セーブ" classes="save" onClick={@changeToSaveMode} />
            <Button key="setting-button" inner="設定" classes="setting" onClick={@changeToSettingMode} />
          </div>
        when "setting"
          items.push <Setting key="setting" config={@config} Action={{@setConfig, @changeMode}} prev={@prevMode}/>
        when "save"
          items.push <SaveView key="save-view" saves={@state.saves} Action={{@save, @load, @changeMode}} prev={@prevMode}/>
        when "title"
          items.push <Title key="title-view" basePath={@config.basePath} Action={{@changeMode}} />
      items.push <Audios key="audios" audios={@state.audios} config={@config}
        Action={
          "setAudio": @setAudioNode
          "playAudio": @playAudio
          "engineExec": @engine?.exec
        }
      />
      return (
        <div id="inner" onClick={@onClick}>
          {items}
        </div>
      )
  ReactDOM.render(
    <Contents />
    document.getElementById 'contents'
  )
