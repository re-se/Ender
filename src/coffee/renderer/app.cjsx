window.onload = () ->
  React = require 'react'
  ReactDOM = require 'react-dom'
  fs = require 'fs'
  {ipcRenderer} = require 'electron'
  update = require 'react-addons-update'
  Engine = require './js/renderer/engine'
  MessageBox = require './js/renderer/MessageBox'
  NameBox = require './js/renderer/NameBox'
  ImageView = require './js/renderer/ImageView'
  HistoryView = require './js/renderer/HistoryView'
  Setting = require './js/renderer/Setting'
  effects = require './js/renderer/effects'

  Contents = React.createClass
    getInitialState: ->
      mode: "main"
      message: null
      images: []
      refs: {}
      tls: null
      config: {}
    componentDidMount: ->
      console.log "start!"
      config = JSON.parse fs.readFileSync('dist/resource/config.json', 'utf8')
      window.addEventListener("keydown", @onKeyDown)
      window.addEventListener("wheel", @onScroll)
      ipcRenderer.on 'show-setting', =>
        @changeMode "setting"
      Action = {@setText, @setName, @setImage, @clearImage, @clear}
      filename = '01.end'
      @engine = new Engine(filename, Action, config)
      @setState config: config, @execAuto
    componentWillUnmount: ->
      window.removeEventListener("keydown", @onKeyDown)
      window.removeEventListener("scroll", @onScroll)
    changeMode: (mode) ->
      unless mode is "main"
        diff = {}
        diff.auto = $set: false
        @setConfig diff
      @setState mode: mode
    startAnimation: (className, effectName, callback) ->
      @tls = []
      @engine.startAnimation()
      cb = =>
        callback?()
        @engine.finishAnimation()
        @execAuto()
      for node in document.getElementsByClassName(className)
        @tls.push effects[effectName](node, cb)
        cb = null
    finishAnimation: (className) ->
      for tl in @tls
        tl.progress(1, false)
      @tls = null
      @engine.finishAnimation()
    setText: (message) ->
      @setState message: message
    setName: (name) ->
      @setState name: name
    setImage: (image) ->
      if image.effect?
        callback = => @startAnimation(image.className, image.effect)
      else
        callback = => @execAuto()
      @setState
        images: @state.images.concat(image)
        , callback
    #target: className(string), effect: name(string)
    clearImage: (target, effect) ->
      images = []
      if target?
        for image in @state.images
          if image.className isnt target
            images.push image
      cb = =>
        @setState
          images: images
      if effect?
        @startAnimation(target, effect, cb)
    clear: ->
      @setState
        message: null
        images: []
    setConfig: (diff) ->
      config = update(@state.config, diff)
      @engine?.config = config
      @setState config: config
    onClick: ->
      switch @state.mode
        when "main"
          if @state.history?
            @setState history: null
          else
            diff = {}
            diff.auto = $set: false
            @setConfig diff
            if @engine.isAnimated and @tls?
              @finishAnimation()
            else
              @engine?.exec()
    onKeyDown: (e) ->
      switch @state.mode
        when "main"
          @onClick() if e.keyCode is 13
        when "setting"
          @setState mode: "main" if e.keyCode is 27
    onScroll: (e) ->
      switch @state.mode
        when "main"
          if e.deltaY < 0 and !@state.history?
            diff = {}
            diff.auto = $set: false
            @setConfig diff
            @setState history: @engine?.history
    execAuto: ->
      if @state.config.auto
        setTimeout =>
          @engine.exec() if @state.config.auto
        , @state.config.autoSpeed
    render: () ->
      switch @state.mode
        when "main"
          items = []
          if @state.name?
            items.push <NameBox key="name" name={@state.name} />
          if @state.history?
            items.push <HistoryView key="history" history={@state.history} />
          items.push <MessageBox key="message" styles="message-1" message={@state.message}/>
          items.push <ImageView key="images" images={@state.images} />
        when "setting"
          items = <Setting key="setting" config={@state.config} />
      return (
        <div id="inner" onClick={@onClick}>
          {items}
        </div>
      )
  ReactDOM.render(
    <Contents />
    document.getElementById 'contents'
  )
