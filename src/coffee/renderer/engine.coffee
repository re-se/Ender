fs = require 'fs'
path = require 'path'
{FuncEngine} = require './func'
{Config} = require './Config'
parser = require './ender.js'

module.exports = class Ender
  constructor: (@Action, @config) ->
    @insts = []
    @pc = 0
    @fe = new FuncEngine(@Action)
    @load(@config.main)

  load: (filename, cb) ->
    @filename = filename
    @parse()
    @pc = 0
    @g = @_exec()
    @clearAll cb

  reload: (filename, cb) ->
    if typeof filename isnt "string"
      cb = filename
      filename = @filename
    @insts = []
    @pc = 0
    @load(filename, cb)

  parse: ->
    textPath = @config.text.path
    textPath = "" if !textPath?
    mainPath = path.join(@config.basePath, textPath, @filename)
    script = fs.readFileSync(mainPath).toString()
    @insts = parser.parse(script).concat @insts[@pc+1..]

  getCurrentState: ->
    [@filename, @pc]

  setCurrentState: (filename, pc, cb) ->
    @reload filename, =>
      @skip(pc, cb)

  skip: (pc, cb) ->
    return if @isSkip
    @isSkip = true
    _g = @g
    callback = =>
      @isSkip = false
      cb()
    @g = @_skip(_g, pc, callback)
    @exec()

  _skip : (_g, pc, cb) ->
    textSpeed = @config.textSpeed
    @Action.setConfig "textSpeed", 0
    audioVolume = @config.volume.Master
    muteVolume = @config.volume
    muteVolume.Master = 0
    @Action.setConfig "volume", muteVolume
    console.log @config
    while @pc < pc || @config.skip
      ret = _g.next()
      console.log ret
      if ret.value is "async"
        yield 0
    muteVolume.Master = audioVolume
    @Action.setConfig "volume", muteVolume
    @Action.setConfig "textSpeed", textSpeed
    @g = _g
    if cb?
      cb()

  finishAnimation: ->
    @isAnimated = false

  startAnimation: ->
    @isAnimated = true

  finishLoad: ->
    @isLoaded = false

  startLoad: ->
    @isLoaded = true

  changeStyle: (style) ->
    @style = Object.assign {}, @style, style
    @addMessage type: "style", value: @style

  addMessage: (message) ->
    @nextMessage.push message

  showMessage: (currentMessage, nextMessage) ->
    me = @messageGen @currentMessage, @nextMessage
    if @config.textSpeed > 0
      @isTextAnimated = true
      cb = () =>
        if (m = me.next()).done
          @isTextAnimated = false
          @autoExec()
        else
          @Action.setText m.value
          @timeoutID = setTimeout cb, @config.textSpeed
      cb()
    else
      @Action.setText @addEndMarker(@currentMessage.concat @nextMessage), => @autoExec()

  clear: (type, className, effect, cb) ->
    switch type
      when "text"
        @currentMessage = []
        @nextMessage = []
        @Action.clear("text", cb)
      when "image"
        @Action.clearImage(className, effect, cb)
      else
        @currentMessage = []
        @nextMessage = []
        @history = ""
        cb = type
        @Action.clear(cb)

  clearAll: (cb) ->
    @history = ""
    @clear(cb)

  _exec: =>
    @isAnimated = false
    @isTextAnimated = false
    @isLoaded = false
    @style = {}
    imagesMap = {}
    @pc = 0
    loop
      inst = @insts[@pc]
      next = @insts[@pc+1]
      if inst?
        console.log inst.type
        switch inst.type
          when "wait"
            @endMarker = if next?.type is "clear" then "▼" else "▽"
            @showMessage()
            yield 0
            @currentMessage = @currentMessage.concat @nextMessage
            @nextMessage = []
            if @isTextAnimated
              clearTimeout @timeoutID
              @Action.setText @addEndMarker(@currentMessage)
              @isTextAnimated = false
              yield 0
          when "text"
            for m in inst.value
              if m.type is "interpolation"
                m.type = "text"
                m.body = @fe.getVar m.expr
              @history += m.body if m.body?
              @history += "\n" if m.type is "br"
            @nextMessage = @nextMessage.concat inst.value
          when "name"
            @currentMessage = []
            @nextMessage = []
            name = inst.name
            if name.length < 1 and @config.text.defaultName?
              name = @config.text.defaultName
            @Action.setName(name)
            @history += "#{name}「"
          when "nameClear"
            @Action.setName(null)
            @history += "」\n"
          # when "br"
          #   message = message.concat type: "br"
          when "clear"
            if inst.message
              @clear "text", =>
                @Action.setText @currentMessage
            else
              console.error inst
              # @history += "\n"
            # if inst.image
            #   console.error "wawawa"
            #   console.dir inst
            #   @Action.clearImage(inst.target, inst.effect, @exec)
            #   @startAnimation()
            #   loop
            #     yield "async"
            #     break if not @isAnimated
          when "funcdecl"
            @fe.addFunc(inst)
          when "func"
            it = @fe.exec(@)
            while not (ret = it.next()).done
              yield ret.value
          else
            console.error inst
      @pc++
      break if @insts.length < @pc

    @clearAll()
    @g = @_exec()

  exec: =>
    try
      ret = @g.next()
      @isAsync = ret.value is "async"
    catch error
      console.error error

  autoExec: ->
    if @config.auto and !@isAsync
      setTimeout =>
        if @config.auto and !@isAsync
          @exec()
      , @config.autoSpeed


  addEndMarker: (message, isNewPage) ->
    endMarker = {type: "marker"}
    endMarker.body = @endMarker
    last = message[message.length - 1]
    if last.type is "br"
      message[0..message.length - 2].concat endMarker, last
    else
      message.concat endMarker

  messageGen: (before, message) ->
    i = 0
    for m in message
      cur = {}
      cur.type = m.type
      j = 1
      if m.body?
        while j <= m.body.length
          cur.body = m.body.substr(0, j)
          yield before.concat message.slice(0, i), cur
          j++
      i++
    yield @addEndMarker before.concat(message)
