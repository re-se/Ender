isObject = (v) ->
  Object(v) is v


class @Config
  constructor: (config) ->
    @_origin = config
    @_config = {}
    @config = {}
    for key, value of config
      if isObject value
        value = new Config value, @_origin
        if value.hasPublic()
          key = "@#{key}" if key[0] isnt "@"
      switch key[0]
        when "@"
          k = key[1..]
          @__defineGetter__ k, ((_key) -> (-> @config[_key]))(k)
          @__defineSetter__ k, ((_key) -> (
            (n) ->
              @config[_key] = n
              @_origin["@" + _key] = n
          ))(k)
          @config[k] = value
        else
          @__defineGetter__ key, ((_key) -> (-> @_config[_key]))(key)
          @__defineSetter__ key, ((_key) -> (
            (n) ->
              @_config[_key] = n
              @_origin[_key] = n
          ))(key)
          @_config[key] = value
    if @.auto
      @.auto = false
  dup: ->
    new Config @_origin

  toString:(space = "", obj=@_origin) ->
    out = "{\n"
    num = 0
    obj.forIn (key, value, index) =>
      if typeof value is "string"
        if num > 0
          out += ",\n"
        out += space + JSON.stringify(key) + ": " + JSON.stringify(value, space)
      else if typeof value is "object"
        if key is "_origin" or key is "_config" or key is "config"
          return
        else
          if num > 0
            out += ",\n"
          out += space + "#{JSON.stringify(key)}: #{value.toString(space + "  ", value)}"
      else if typeof value is "function"
        return
      else
        if num > 0
          out += ",\n"
        out += space + "#{JSON.stringify(key)}: #{JSON.stringify(value, space)}"
      num++
    out += "\n"
    out += space + "}"
    out

  hasPublic: ->
    Object.getOwnPropertyNames(@config).length > 0
