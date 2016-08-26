fs = require 'fs'
path = require 'path'
{FuncEngine} = require './func'
{Config} = require './Config'

module.exports = class Ender
  constructor: (@filename, @Action, @config) ->
    @parse()
    @fe = new FuncEngine(@insts, @Action)
    @g = @_exec()
    @currentMessage = []
    @nextMessage = []
    @history = ""

  parse: () ->
    parser = require '../../../ender.js'
    @basePath = path.resolve() + "/dist/resource/"
    @script = fs.readFileSync(@basePath + @filename).toString()
    @insts = parser.parse(@script)

  finishAnimation: ->
    @isAnimated = false

  startAnimation: ->
    @isAnimated = true

  execAuto: ->
    console.trace()
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

  addMessage: (message) ->
    @nextMessage.push message

  showMessage: (currentMessage, nextMessage) ->
    me = @messageGen currentMessage, nextMessage
    if @config.textSpeed > 0
      @isTextAnimated = true
      cb = () =>
        if (m = me.next()).done
          @isTextAnimated = false
          @execAuto()
        else
          @Action.setText m.value
          @timeoutID = setTimeout cb, @config.textSpeed
      cb()
    else
      @Action.setText @addEndMarker(currentMessage.concat nextMessage), => @execAuto()

  clear: (type, className, effect) ->
    switch type
      when "image"
        @Action.clearImage(className, effect)
        @isAnimated = true
      else
        console.error type

  _exec: =>
    @isAnimated = false
    @isTextAnimated = false
    imagesMap = {}
    style = {}
    @pc = 0
    loop
      inst = @insts[@pc]
      next = @insts[@pc+1]
      console.log inst.type
      switch inst.type
        when "wait"
          @endMarker = if next?.type is "clear" then "▼" else "▽"
          @showMessage(@currentMessage, @nextMessage)
          yield 0
          @currentMessage = @currentMessage.concat @nextMessage
          @nextMessage = []
          if @isTextAnimated
            clearTimeout @timeoutID
            @Action.setText @addEndMarker(@currentMessage)
            yield 0
        when "text"
          for m in inst.value
            @history += m.body if m.body?
            @history += "\n" if m.type is "br"
          @nextMessage = @nextMessage.concat inst.value
        when "name"
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
        when "func"
          it = @fe.exec(@)
          while not (ret = it.next()).done
            yield ret.value
        else
          console.error inst
      @pc++
      break unless next?

    @Action.clear()
    @history = ""
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
