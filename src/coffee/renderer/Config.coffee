isObject = (v) ->
  Object(v) is v


class @Config
  constructor: (config) ->
    @_origin = config
    @_config = {}
    @config = {}
    for key, value of config
      if isObject value
        value = new Config value
        if value.hasPublic()
          key = "@#{key}" if key[0] isnt "@"
      switch key[0]
        when "@"
          k = key[1..]
          @__defineGetter__ k, ((_key) -> (-> @config[_key]))(k)
          @__defineSetter__ k, ((_key) -> ((n) -> @config[_key] = n))(k)
          @config[k] = value
        else
          @__defineGetter__ key, ((_key) -> (-> @_config[_key]))(key)
          @__defineSetter__ key, ((_key) -> ((n) -> @_config[_key] = n))(key)
          @_config[key] = value

  dup: ->
    new Config @_origin

  hasPublic: ->
    Object.getOwnPropertyNames(@config).length > 0
