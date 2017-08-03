FuncMap =
  "img": (engine, inst) ->
    image = {}
    image.src = @getArg(inst, 0)
    image.className = @getArg(inst, 1)
    image.effect = @getArg(inst, 2)
    image.callback = engine.exec
    id = @Action.setImage image
    loop
      yield "async"
      break if not engine.isAnimated
  "effect": (engine, inst) ->
    target = @getArg(inst, 0)
    effectName = @getArg(inst, 1)
    @Action.startAnimation target, effectName, engine.exec
    yield "async" while engine.isAnimated
  "aeffect": (engine, inst) ->
    target = @getArg(inst, 0)
    effectName = @getArg(inst, 1)
    @Action.startAnimation target, effectName
  "style": (engine, inst) ->
    style = @getArg(inst, 0)
    engine.changeStyle style
  "clear": (engine, inst) ->
    type = @getArg(inst, 0)
    className = @getArg(inst, 1)
    effect = @getArg(inst, 2)
    engine.clear(type, className, effect, engine.exec)
    loop
      yield "async"
      break if not engine.isAnimated
  "skip": (engine) ->
    if engine.config.debug && engine.config.debugParam?.skip
      @Action.setConfig "skip", true
  "stop": (engine) ->
    if engine.config.debug && engine.config.debugParam?.skip
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
    engine.load path, ->
      engine.pc--
      engine.exec()
    yield "async"
  "loadAudio": (engine, inst) ->
    audio =
      "type": @getArg(inst, 0)
      "name": @getArg(inst, 1)
      "src": @getArg(inst, 2)
      "loopSrc": @getArg(inst, 3)
      "option": @getArg(inst, 4)
    console.log "loadAudio:", audio
    loopAudio = @Action.loadAudio(audio)
    loop
      yield "async"
      break if not engine.isLoaded
    if loopAudio?
      # @Action.loadAudio loopAudio
      loop
        yield "async"
        break if not engine.isLoaded
  "playAudio": (engine, inst) ->
    name = @getArg(inst, 0)
    effect = @getArg(inst, 1)
    @Action.playAudio(name, effect)
  "stopAudio": (engine, inst) ->
    name = @getArg(inst, 0)
    effect = @getArg(inst, 1)
    @Action.stopAudio(name, effect)
  "pauseAudio": (engine, inst) ->
    name = @getArg(inst, 0)
    @Action.pauseAudio(name)
  "setStyle": (engine, inst) ->
    target = @getArg(inst, 0)
    className = @getArg(inst, 1)
    @Action.setStyle(target, className)

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
