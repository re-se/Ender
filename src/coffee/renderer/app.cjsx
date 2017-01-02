
window.onload = () ->
  React = require 'react'
  ReactDOM = require 'react-dom'
  {ipcRenderer, remote} = require 'electron'
  app = remote.app
  fs = require 'fs'
  path = require 'path'
  {ipcRenderer, remote, webFrame} = require 'electron'
  remote.getCurrentWindow().removeAllListeners()
  webFrame.setZoomLevelLimits(1, 1)
  app = remote.app
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
  configPath = path.join app.getAppPath(), 'dist/resource/config.json'
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
      @config
      for prop in ["basePath", "savePath"]
        if @config[prop]?
          @config.__defineGetter__ prop, ((key) ->
            ->
              if path.isAbsolute(@_config[key])
                @_config[key]
              else
                path.join app.getAppPath(), @_config[key]
          )(prop)
      @config.auto = false
      @audioContext = new AudioContext()
      @audioNodes = {}
      @loadAudioNodes()
      @loadSaveFiles()
      @bgmState = {}
    componentDidMount: ->
      console.log "start!"
      effects.show(cover)
      effects.hide(cover)
      @prevMode = @state.mode
      # config = JSON.parse fs.readFileSync('dist/resource/config.json', 'utf8')
      # @config = new Config config
      window.addEventListener("keydown", @onKeyDown)
      window.addEventListener("wheel", @onScroll)
      window.ondragstart = window.ondragover = window.ondrop = (e) ->
        console.log e
        e.preventDefault()
        false
      ipcRenderer.on 'show-setting', =>
        @changeToSettingMode()
      ipcRenderer.on 'show-title', =>
        if window.confirm("タイトルに戻ります。よろしいですか？")
          @clear =>
            @changeMode 'title'
      Action = {@setText, @setName, @setImage, @clearImage, @clear, @startAnimation, @setConfig, @loadAudio, @playAudio, @stopAudio, @pauseAudio}
      @engine = new Engine(Action, @config)
      # @setState config: config, @engine.exec
      # @engine.exec()
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

    loadAudioNodes: ->
      @config.audioNode.forIn (key, node) =>
        if key isnt "_origin" and key isnt "config" and key isnt "_config"
          switch node.type
            when "gain"
              @audioNodes[key] = @audioContext.createGain()
            when "delay"
              @audioNodes[key] = @audioContext.createDelay(5.0)
            when "convolver"
              @audioNodes[key] = @audioContext.createConvolver()
            when "biquadFilter"
              @audioNodes[key] = @audioContext.createBiquadFilter()
            when "dynamicsCompressor"
              @audioNodes[key] = @audioContext.createDynamicsCompressor()
            when "waveShaper"
              @audioNodes[key] = @audioContext.createWaveShaper()
      @config.audioNode.forIn (key, node) =>
        if key isnt "_origin" and key isnt "config" and key isnt "_config"
          con = if node.to? then @audioNodes[node.to] else @audioContext.destination
          @audioNodes[key].connect con
          console.log con
      @config.volume.forIn (key, node) =>
        if key isnt "_origin" and key isnt "config" and key isnt "_config"
          @audioNodes[key].gain.value = node / 100.0

    changeMode: (mode, cb) ->
      cover = document.getElementById("cover")
      effects.show(cover)
      unless mode is "main"
        @setConfig "auto", false
      @prevMode = @state.mode
      @setState mode: mode, =>
        effects.hide(cover)
        cb?()
    Pause: ->
      @setConfig "auto", false

    startAnimation: (target, effectName, callback) ->
      @tls = []
      @engine.startAnimation()
      if typeof target isnt "string"
        cb = =>
          @engine.finishAnimation()
          effectName?()
        return cb() if !target.effect?
        node = document.getElementById(target.src)
        @tls.push effects[target.effect](node, cb)
      else
        cb = =>
          @engine.finishAnimation()
          callback?()
        nodes = document.querySelectorAll target
        nodes = document.getElementsByClassName(target) if nodes.length < 1
        for node in nodes
          @tls.push effects[effectName](node, cb)
          cb = null
      if @state.mode isnt "main" || @config.skip
        @finishAnimation()
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
    setImage: (image, cb) ->
      arr = @state.images[image.className]
      diff = {}
      if image.callback?
        origin = image.callback
        if arr?
          image.callback = =>
            @startAnimation image, =>
              fdiff = {}
              fdiff[image.className] = "$set": [image]
              @setState
                images: update(@state.images, fdiff)
                , origin
          arr = arr.concat image
        else
          image.callback = => @startAnimation image, origin
          arr = [image]
        diff[image.className] = "$set": arr
        @setState
          images: update(@state.images, diff)
          , cb
      else
        arr = [image]
        diff[image.className] = "$set": arr
        @setState
          images: update(@state.images, diff)
          , cb
    clearImage: (target, effect, callback) ->
      diff = {}
      diff[target] = "$set": []
      cb = =>
        @setState
          images: update(@state.images, diff)
          , callback
      if effect?
        @startAnimation(target, effect, cb)
      else
        cb()
    genAudioStyle: (audio) ->
      style = {}
      if @config.audio.hasOwnProperty audio.type
        Object.assign style, @config.audio[audio.type]
      if audio.option
        style.forIn (key, value) ->
          if audio.option.hasOwnProperty key
            style[key] = audio.option[key]
      style
    loadAudio: (audio) ->
      # merge audio style, Config(default) style and Option style
      @engine.startLoad()
      style = @genAudioStyle(audio)
      newAudios = {}
      newAudios[audio.name] = audio
      if style.loop && audio.loopSrc?
        loopAudio =
          "type": audio.type,
          "name": "#{audio.name}_loop",
          "src": "#{audio.loopSrc}"
          "loopSrc": null
          "option": if audio.option? then audio.option else {}
        newAudios[loopAudio.name] = loopAudio
      newAudios = update @state.audios,
       "$merge": newAudios
      @setState audios: newAudios
      loopAudio

    setAudioNode: (name, dom) ->
      if @state.audios[name]?
        node = @audioContext.createMediaElementSource dom
        @state.audios[name].node = node
        @engine.finishLoad()
        @engine.exec()
    playAudio: (name) ->
      if !@state.audios[name]?
        console.error "@state.audios[#{name}] is undefined"
        return
      style = @genAudioStyle @state.audios[name]
      if @engine.isSkip
        if !style.loop
          return
      if @state.audios[name].node?
        gain = @audioNodes[style.amp]
        @state.audios[name].node?.connect if gain? then gain else @audioContext.destination
        (document.getElementById "audio-#{name}").play()
      else
        console.error "@state.audios[#{name}].node is undefined"
    stopAudio: (name) ->
      if !@state.audios[name]?
        console.error "@state.audios[#{name}] is undefined"
        return
      if @engine.isSkip
        style = @genAudioStyle @state.audios[name]
        if !style.loop
          return
      if @state.audios[name]?
        audioDom = document.getElementById "audio-#{name}"
        console.log audioDom
        audioDom.pause()
        audioDom.currentTime = 0
    pauseAudio: (name) ->
      if !@state.audios[name]?
        console.error "@state.audios[#{name}] is undefined"
        return
      if @engine.isSkip
        style = @genAudioStyle @state.audios[name]
        if !style.loop
          return
      if @state.audios[name]?
        (document.getElementById "audio-#{name}").pause()
    refreshGain: ->
      @audioNodes.forIn (key, value) =>
        @audioNodes[key].gain.value = @config.volume[key] / 100

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
        @screenshot = img.resize width: 200
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

    clear: (type, cb) ->
      s = switch type
        when "text"
          message: null
        else
          cb = () -> type?()
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
          mainItems = []
          if @state.name?
            mainItems.push <NameBox key="name" name={@state.name} />
          if @state.history?
            mainItems.push <HistoryView key="history" history={@state.history} />
          if @state.message?.length > 0 && !@config.hideMessageBox
            mainItems.push <MessageBox key="message" styles={@config.text.styles} message={@state.message}/>

          saveButtonInner = [
            <i key="save-button-icon" className="fa fa-floppy-o" aria-hidden="true"/>,
            <span key="save-button-text"> セーブ </span>
          ]
          settingButtonInner = [
            <i key="setting-button-icon" className="fa fa-cog" aria-hidden="true"/>,
            <span key="setting-button-text"> 設定 </span>
          ]
          mainItems.push <div key="toolbar" className="toolbar">
            <Button key="save-button" inner={saveButtonInner} classes="save" onClick={@changeToSaveMode}/>
            <Button key="setting-button" inner={settingButtonInner} classes="setting" onClick={@changeToSettingMode} />
          </div>

          items.push <div className="main-view" key="main-view">
            {mainItems}
          </div>
        when "setting"
          items.push <Setting key="setting" config={@config} Action={{@setConfig, @changeMode}} prev={@prevMode}/>
        when "save"
          items.push <SaveView key="save-view" saves={@state.saves} Action={{@save, @load, @changeMode}} prev={@prevMode}/>
        when "title"
          items.push <Title key="title-view" basePath={@config.basePath}
            Action={{@changeMode, engineLoad: => @engine.reload(@config.main)}} />
      imagePath = [@config.basePath]
      imagePath.push @config.image.path if @config.image?.path?
      imagePath = path.join.apply @, imagePath
      items.push <ImageView key="images" images={@state.images} basePath={imagePath} />
      items.push <Audios key="audios" audios={@state.audios} config={@config}
        Action={
          "setAudio": @setAudioNode
          "playAudio": @playAudio
          "engineExec": @engine?.exec
        }
      />
      items.push <div key="cover" id="cover"/>
      return (
        <div id="inner" className="inner-view" key="inner-view" onClick={@onClick}>
          {items}
        </div>
      )
  ReactDOM.render(
    <Contents />
    document.getElementById 'contents'
  )
