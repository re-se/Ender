fs = require 'fs'
path = require 'path'
{FuncEngine} = require './func'
{Config} = require './Config'
parser = require '../../../ender.js'

module.exports = class Ender
  constructor: (@Action, @config) ->
    @insts = []
    @pc = 0
    @parse(@config.main)
    @pc++
    @fe = new FuncEngine(@Action)
    @g = @_exec()
    @currentMessage = []
    @nextMessage = []
    @history = ""

  parse: (p) ->
    @filename = p
    mainPath = path.join(@config.basePath, p)
    script = fs.readFileSync(mainPath).toString()
    @insts = parser.parse(script).concat @insts[@pc+1..]
    @pc = -1

  getCurrentState: ->
    [@filename, @pc]

  setCurrentState: (filename, pc, cb) ->
    @parse filename
    @clearAll () =>
      @skip(pc, cb)

  skip: (pc, cb) ->
    _g = @g
    @g = @_skip(_g, pc, cb)
    @exec()

  _skip : (_g, pc, cb) ->
    textSpeed = @config.textSpeed
    @Action.setConfig "textSpeed", 0
    while @pc < pc
      ret = _g.next()
      if ret.value is "async"
        yield 0
    @Action.setConfig "textSpeed", textSpeed
    @g = _g
    if cb?
      cb()


  finishAnimation: ->
    @isAnimated = false

  startAnimation: ->
    @isAnimated = true

  autoExec: ->
    if @config.skip
      if @config.textSpeed > 0
        @_config = @config.dup()
        @Action.setConfig "textSpeed", 0
      else
        setTimeout =>
          @exec() if @config.skip
        , 0
      return
    else
      if @_config?
        @_config.skip = false
        @config = @_config
        @_config = null
        @Action.setConfig @config
        return
    if @config.auto
      setTimeout =>
        @exec() if @config.auto
      , @config.autoSpeed

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

  clear: (type, className, effect) ->
    switch type
      when "text"
        @currentMessage = []
        @nextMessage = []
        @Action.clear("text")
      when "image"
        @Action.clearImage(className, effect)
        @isAnimated = true
      else
        @currentMessage = []
        @nextMessage = []
        @Action.clear(type)

  clearAll: (cb) ->
    @history = ""
    @clear(cb)

  _exec: =>
    @isAnimated = false
    @isTextAnimated = false
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
            @Action.setName(inst.name)
            @history += "#{inst.name}「"
          when "nameClear"
            @Action.setName(null)
            @history += "」\n"
          # when "br"
          #   message = message.concat type: "br"
          when "clear"
            if inst.message
              @currentMessage = []
              @nextMessage = []
              @Action.setText @currentMessage
              # @history += "\n"
            if inst.image
              @Action.clearImage(inst.target, inst.effect)
              @isAnimated = true
              yield 0 while @isAnimated
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
    @g.next()

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
