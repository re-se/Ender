isObject = (v) ->
  Object(v) is v

fs = require 'fs'
path = require 'path'
{remote} = require 'electron'
app = remote.app

class @Config
  constructor: (config, toplevel=true, isPublic=false) ->
    if typeOf(config) is "String"
      @_configPath = path.dirname config
      try
        config = JSON.parse fs.readFileSync(config, 'utf8')
      catch error
        console.warn error
        config = {}
    config = {} if !config?
    @_origin = config
    @__config = {}
    @_config = {}
    if toplevel
      if config.base?
        base = config.base
      else
        base = "dist/resource/_base.json"
        toplevel = false
      base = path.join(app.getAppPath(), base) if not path.isAbsolute base
      @_baseConfig = new Config base, toplevel
      @_baseConfig._forEach (key, value) =>
        @addProperty key
    for key, value of config
      key = @toPublic(key) if isPublic
      @addProperty key, value

  toPublic: (key) ->
    if key[0] is "@" then key else "@#{key}"

  dup: ->
    new Config @_origin

  addProperty: (key, value) ->
    if not (value instanceof Config)
      if isObject value
        value = new Config value, false, key[0] is "@"
        key = @toPublic(key) if value.hasPublic()
    switch key[0]
      when "@"
        k = key[1..]
        @__defineGetter__ k, ((_key) -> (
          ->
            if @_config[_key]? then @_config[_key] else @_baseConfig?[_key]
        ))(k)
        @__defineSetter__ k, ((_key) -> (
          (n) ->
            @_config[_key] = n
            @_origin["@" + _key] = n
        ))(k)
        @_config[k] = value
      else
        @__defineGetter__ key, ((_key) -> (
          ->
            if @__config[_key]? then @__config[_key] else @_baseConfig?[_key]
        ))(key)
        @__defineSetter__ key, ((_key) -> (
          (n) ->
            @__config[_key] = n
            @_origin[_key] = n
        ))(key)
        @__config[key] = value

  extendGetter: (key, f) ->
    if @_origin[key]?
      originGetter = @__lookupGetter__(key)
      @__defineGetter__ key, f(key, originGetter)
    else
      @_baseConfig.extendGetter(key, f)


  forEach: (func, self) ->
    self = @ if !self?
    for key, value of @
      if key[0] is "_" or (typeOf(value) is "Function")
        continue
      func.call self, key, value

  _forEach: (func, self) ->
    self = @ if !self?
    for key, value of @_origin
      if key[0] is "_" or (typeOf(value) is "Function")
        continue
      func.call self, key, value


  toString:(space = "", isPublic = false) ->
    out = "{\n"
    num = 0
    @._forEach (key, value) =>
      if isPublic and key[0] is "@"
        key = key[1..]
      switch typeof value
        when "string"
          if num > 0
            out += ",\n"
          out += space + JSON.stringify(key) + ": " + JSON.stringify(value, space)
        when "object"
          if num > 0
            out += ",\n"
          if !(value?)
            out += space + "#{JSON.stringify(key)}: null"
          else
            if key[0] is "@"
              value = @[key[1..]] if !value?
              isPublic = true
            else
              value = @[key]
            out += space + "#{JSON.stringify(key)}: #{value.toString(space + "  ", isPublic)}"
        when "function"
          return
        else
          if num > 0
            out += ",\n"
          out += space + "#{JSON.stringify(key)}: #{JSON.stringify(value, space)}"
      num++
    out += "\n"
    out += (if(space.length < 2) then space else space.substring(0, space.length - 2)) + "}"
    out

  hasPublic: ->
    Object.getOwnPropertyNames(@_config).length > 0
