isObject = (v) ->
  Object(v) is v

fs = require 'fs'
path = require 'path'
{remote} = require 'electron'
{ConfigInputFactory} = require './configInput/ConfigInputFactory'
{ConfigInput} = require './configInput/ConfigInput'
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
        @addProperty(key, (if key[0] is "@" then value else undefined), true)
    for key, value of config
      key = @toPublic(key) if isPublic
      @addProperty key, value

  toPublic: (key) ->
    if key[0] is "@" then key else "@#{key}"

  dup: ->
    new Config @_origin

  addProperty: (key, value, isExpected = false) ->
    originValue = value
    if not (value instanceof Config)
      if isObject value
        # Config か ConfigInput かを $value 要素の有無で判別
        if value.hasOwnProperty "$value"
          value = ConfigInputFactory.create key, value["$value"], value.displayName, value.attrs, value.type
          key = @toPublic(key)
        else
          value = new Config value, false, key[0] is "@"
          key = @toPublic(key) if value.hasPublic()
    switch key[0]
      when "@"
        k = key[1..]
        # 継承した要素
        # if !value?
        #   @__defineGetter__ k, ((_key) -> (
        #     ->
        #       if @_config[_key]? then @_config[_key] else @_baseConfig?[_key]
        #   ))(k)
        #   @__defineSetter__ k, ((_key) -> (
        #     (n) ->
        #       @_config[_key].value = n
        #       if @_origin["@" + _key]?
        #         @_origin["@" + _key]["$value"] = n
        #       else if @_origin[_key]
        #         @_origin[_key]["$value"] = n
        #       else
        #         @_baseConfig?[_key] = n
        #   ))(k)
        #   configInput = @_baseConfig?.getConfigInput(k)
        #   if configInput?
        #     @_config[k] = configInput.dup()
        #     @_origin[key] = configInput.getConfigJson()
        #   else
        #     @_config[k] = value
        ## 階層を掘るためのオブジェクト
        # else if value instanceof Config
        if value instanceof Config
          @__defineGetter__ k, ((_key) -> (
            ->
              if @_config[_key]? then @_config[_key] else @_baseConfig?[_key]
          ))(k)
          @__defineSetter__ k, ((_key) -> (
            (n) ->
              @_config[_key] = n
              if @_origin["@" + _key]?
                @_origin["@" + _key] = n
              else if @_origin[_key]
                @_origin[_key] = n
              else
                @_baseConfig?[_key] = n
          ))(k)
          @_config[k] = value
          if isExpected
            @_origin[key] = originValue
        else
          # 公開要素の値がプリミティブ値ならば ConfigInput でラップ
          if !(value instanceof ConfigInput)
            value = ConfigInputFactory.create key, value, k
          @__defineGetter__ k, ((_key) -> (
            ->
              if @_config[_key]? then @_config[_key].value else @_baseConfig?[_key].value
          ))(k)
          @__defineSetter__ k, ((_key) -> (
            (n) ->
              @_config[_key].value = n
              if @_origin["@" + _key]?
                @_origin["@" + _key]["$value"] = n
              else if @_origin[_key]
                @_origin[_key]["$value"] = n
              else
                @_baseConfig?[_key] = n
          ))(k)
          @_config[k] = value
          if isExpected
            @_origin[key] = originValue
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

  # ユーザー設定可能な要素のみの forEach
  forEachPublicOnly: (func, self) ->
    self = @ if !self?
    for key of @._config
      if key[0] is "_" or (typeOf(@[key]) is "Function")
        continue
      func.call self, key, @[key]

  # ユーザー設定が不可能な要素のみの forEach
  forEachPrivateOnly: (func, self) ->
    self = @ if !self?
    for key of @.__config
      if key[0] is "_" or (typeOf(@[key]) is "Function")
        continue
      func.call self, key, @[key]

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
      # ConfigInput チェック
      if @.getConfigInput(key)?
        value = @.getConfigInput(key)
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
              out += space + "#{JSON.stringify(key)}: #{JSON.stringify(value, null,  space + "  ")}"
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

  getConfigInput: (key) ->
    return if @._config[key]? and @._config[key] instanceof ConfigInput then @._config[key] else @._baseConfig?.getConfigInput(key)
