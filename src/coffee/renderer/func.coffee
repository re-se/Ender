class @FuncEngine
  constructor: (@mainInsts, @Action) ->
    @funcMap = {}
  addFunc: (inst) ->
    @funcMap[inst.name] = {body: inst.body, args: inst.args}
  getArg: (inst, n) ->
    if inst.args[n].type is "var"
      @nameMap[inst.args[n].name]
    else
      inst.args[n]
  exec: (engine) ->
    inst = @mainInsts[engine.pc]
    @nameMap = {}
    console.log "func: #{inst.name}"
    loop
      if @insts?
        inst = @insts[@pc]
      switch inst.name
        when "img"
          image = {}
          image.src = @getArg(inst, 0)
          image.className = @getArg(inst, 1)
          image.effect = @getArg(inst, 2)
          id = @Action.setImage image
          if image.effect?
            engine.startAnimation()
            yield 0 while engine.isAnimated
          else
            yield 0
        when "effect"
          target = @getArg(inst, 0)
          effectName = @getArg(inst, 1)
          @Action.startAnimation target, effectName
          yield 0 while engine.isAnimated
        when "style"
          style = Object.assign {}, style, inst.args[0]
          engine.addMessage type: "style", value: style
        when "clear"
          type = @getArg(inst, 0)
          className = @getArg(inst, 1)
          effect = @getArg(inst, 2)
          engine.clear(type, className, effect)
          yield 0 while engine.isAnimated
        when "skip"
          @Action.setConfig "skip", true
        when "stop"
          @Action.setConfig "skip", false
          yield 0
        else
          if @funcMap[inst.name]?
            @insts = @funcMap[inst.name].body
            @pc = -1
            if @funcMap[inst.name].args?
              i = 0
              for arg in @funcMap[inst.name].args
                @nameMap[arg] = inst.args[i]
                i++
          console.error inst
      if !@insts? or @insts.length - 1 <= @pc
        @insts = undefined
        @pc = undefined
        break
      @pc++
