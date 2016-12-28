FuncMap =
  "img": (engine, inst) ->
    image = {}
    image.src = @getArg(inst, 0)
    image.className = @getArg(inst, 1)
    image.effect = @getArg(inst, 2)
    id = @Action.setImage image
    if image.effect?
      engine.startAnimation()
      yield 0 while engine.isAnimated
    # else
    #   yield 0
  "effect": (engine, inst) ->
    target = @getArg(inst, 0)
    effectName = @getArg(inst, 1)
    @Action.startAnimation target, effectName
    yield 0 while engine.isAnimated
  "style": (engine, inst) ->
    style = @getArg(inst, 0)
    engine.changeStyle style
  "clear": (engine, inst) ->
    type = @getArg(inst, 0)
    className = @getArg(inst, 1)
    effect = @getArg(inst, 2)
    engine.clear(type, className, effect)
    yield 0 while engine.isAnimated
  "skip": (engine) ->
    if engine.config.debug
      @Action.setConfig "skip", true
  "stop": (engine) ->
    if engine.config.debug
      @Action.setConfig "skip", false
    yield 0
  "set": (engine, inst) ->
    name = @getArg(inst, 0)
    value = @getArg(inst, 1)
    @setVar(name, value)
    console.log "set: #{name} ->"
    console.dir value
  "get": (engine, inst) ->
    name = @getArg(inst, 0)
    value = @getVar(name)
    console.log "get: #{name} ->"
    console.dir value
  "load": (engine, inst) ->
    path = @getArg(inst, 0)
    engine.parse(path)
  "loadAudio": (engine, inst) ->
    audio =
      "type": @getArg(inst, 0)
      "name": @getArg(inst, 1)
      "src": @getArg(inst, 2)
      "loopSrc": @getArg(inst, 3)
      "option": @getArg(inst, 4)
    console.log "loadAudio:", audio
    loopAudio = @Action.loadAudio(audio)
    yield "async"
    if loopAudio?
      @Action.loadAudio loopAudio
      yield "async"
  "playAudio": (engine, inst) ->
    name = @getArg(inst, 0)
    @Action.playAudio(name)
  "stopAudio": (engine, inst) ->
    name = @getArg(inst, 0)
    @Action.stopAudio(name)
  "pauseAudio": (engine, inst) ->
    name = @getArg(inst, 0)
    @Action.pauseAudio(name)


class @FuncEngine
  constructor: (@Action) ->
    @funcMap = {}
    @nameMap = {}
    @nameMap.global = {}
  addFunc: (inst) ->
    @funcMap[inst.name] = {body: inst.body, args: inst.args}
  getVar: (name) ->
    if Object(name) is name
      ret = @nameMap.global
      obj = name
      while obj?
        name = Object.keys(obj)[0]
        ret = ret[name]
        obj = obj[name]
      ret
    else
      @nameMap.global[name]
  setVar: (name, value) ->
    if value?
      @nameMap.global[name] = value
    else
      Object.assign @nameMap.global, name
  getArg: (inst, n) ->
    return undefined unless inst.args[n]?
    if inst.args[n].type is "var"
      @nameMap.local[inst.args[n].name]
    else
      inst.args[n]
  exec: (engine) ->
    inst = engine.insts[engine.pc]
    @nameMap.local = {}
    console.log "func: #{inst.name}"
    loop
      if @insts?
        inst = @insts[@pc]
      if FuncMap[inst.name]?
        ret = (FuncMap[inst.name].bind(@))(engine, inst)
        if ret?[Symbol.iterator]?
          yield from ret
      else
        if @funcMap[inst.name]?
          @insts = @funcMap[inst.name].body
          @pc = -1
          if @funcMap[inst.name].args?
            i = 0
            for arg in @funcMap[inst.name].args
              @nameMap.local[arg] = inst.args[i]
              i++
        else
          console.error inst
      if !@insts? or @insts.length - 1 <= @pc
        @insts = undefined
        @pc = undefined
        break
      @pc++
