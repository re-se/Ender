class @FuncEngine
  constructor: (@insts, @Action) ->
  exec: (engine) ->
    inst = @insts[engine.pc]
    console.log "func: #{inst.name}"
    switch inst.name
      when "img"
        image = {}
        image.src = inst.args[0]
        image.className = inst.args[1]
        image.effect = inst.args[2]
        id = @Action.setImage image
        if image.effect?
          engine.startAnimation()
          yield 0 while engine.isAnimated
        else
          yield 0
      when "effect"
        target = inst.args[0]
        effectName = inst.args[1]
        @Action.startAnimation target, effectName
        yield 0 while engine.isAnimated
      when "style"
        style = Object.assign {}, style, inst.args[0]
        engine.addMessage type: "style", value: style
      when "clear"
        type = inst.args[0]
        className = inst.args[1]
        effect = inst.args[2]
        engine.clear(type, className, effect)
        yield 0 while engine.isAnimated
      when "skip"
        @Action.setConfig "skip", true
      when "stop"
        @Action.setConfig "skip", false
        yield 0
      else
        console.error inst
