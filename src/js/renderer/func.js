// @flow

const FuncMap = {
  *"img"(engine, inst) {
    let image = {};
    image.src = this.getArg(inst, 0);
    image.className = this.getArg(inst, 1);
    image.effect = this.getArg(inst, 2);
    image.callback = engine.exec;
    let id = this.Action.setImage(image);
    return yield* (function*() {
      let result = [];
      while (true) {
        let item;
        yield "async";
        if (!engine.isAnimated) { break; }
        result.push(item);
      }
      return result;
    }).call(this);
  },
  *"effect"(engine, inst) {
    let target = this.getArg(inst, 0);
    let effectName = this.getArg(inst, 1);
    this.Action.startAnimation(target, effectName, engine.exec);
    return yield* (function*() {
      let result = [];
      while (engine.isAnimated) {
        result.push(yield "async");
      }
      return result;
    }).call(this);
  },
  "aeffect"(engine, inst) {
    let target = this.getArg(inst, 0);
    let effectName = this.getArg(inst, 1);
    return this.Action.startAnimation(target, effectName);
  },
  "style"(engine, inst) {
    let style = this.getArg(inst, 0);
    return engine.changeStyle(style);
  },
  *"clear"(engine, inst) {
    let type = this.getArg(inst, 0);
    let className = this.getArg(inst, 1);
    let effect = this.getArg(inst, 2);
    engine.clear(type, className, effect, engine.exec);
    return yield* (function*() {
      let result = [];
      while (true) {
        let item;
        yield "async";
        if (!engine.isAnimated) { break; }
        result.push(item);
      }
      return result;
    }).call(this);
  },
  "skip"(engine) {
    if (engine.config.debug) {
      return this.Action.setConfig("skip", true);
    }
  },
  *"stop"(engine) {
    if (engine.config.debug) {
      this.Action.setConfig("skip", false);
    }
    return yield 0;
  },
  "set"(engine, inst) {
    let name = this.getArg(inst, 0);
    let value = this.getArg(inst, 1);
    this.setVar(name, value);
    console.log(`set: ${name} ->`);
    return console.dir(value);
  },
  "get"(engine, inst) {
    let name = this.getArg(inst, 0);
    let value = this.getVar(name);
    console.log(`get: ${name} ->`);
    return console.dir(value);
  },
  *"load"(engine, inst) {
    let path = this.getArg(inst, 0);
    engine.load(path, function() {
      engine.pc--;
      return engine.exec();
    });
    return yield "async";
  },
  *"loadAudio"(engine, inst) {
    let audio = {
      "type": this.getArg(inst, 0),
      "name": this.getArg(inst, 1),
      "src": this.getArg(inst, 2),
      "loopSrc": this.getArg(inst, 3),
      "option": this.getArg(inst, 4)
    };
    console.log("loadAudio:", audio);
    let loopAudio = this.Action.loadAudio(audio);
    while (true) {
      yield "async";
      if (!engine.isLoaded) { break; }
    }
    if (loopAudio != null) {
      // @Action.loadAudio loopAudio
      return yield* (function*() {
        let result = [];
        while (true) {
          let item;
          yield "async";
          if (!engine.isLoaded) { break; }
          result.push(item);
        }
        return result;
      }).call(this);
    }
  },
  "playAudio"(engine, inst) {
    let name = this.getArg(inst, 0);
    return this.Action.playAudio(name);
  },
  "stopAudio"(engine, inst) {
    let name = this.getArg(inst, 0);
    return this.Action.stopAudio(name);
  },
  "pauseAudio"(engine, inst) {
    let name = this.getArg(inst, 0);
    return this.Action.pauseAudio(name);
  }
};

export default class FuncEngine {
  Action: any;
  funcMap: Map<string, {body: Array<Inst>, args: any}>;
  nameMap: any;
  insts: Inst[];
  pc: number;
  constructor(Action: any) {
    this.Action = Action;
    this.funcMap = new Map;
    this.nameMap = {};
    this.nameMap.global = {};
  }
  addFunc(inst: Inst) {
    this.funcMap.set(inst.name, {body: inst.body, args: inst.args});
  }
  getVar(name: {} & string) {
    if (Object(name) === name) {
      let ret = this.nameMap.global;
      let obj = name;
      while (obj != null) {
        name = Object.keys(obj)[0];
        ret = ret[name];
        obj = obj[name];
      }
      return ret;
    } else {
      return this.nameMap.global[name];
    }
  }
  setVar(name: string & {}, value: ?any) {
    if (value != null) {
      return this.nameMap.global[name] = value;
    } else {
      return Object.assign(this.nameMap.global, name);
    }
  }
  getArg(inst: Inst, n: number) {
    if (inst.args[n] == null) { return undefined; }
    if (inst.args[n].type === "var") {
      return this.nameMap.local[inst.args[n].name];
    } else {
      return inst.args[n];
    }
  }
  *exec(engine: any): Generator<any, void, any> {
    let inst = engine.insts[engine.pc];
    this.nameMap.local = {};
    this.insts = [];
    console.log(`func: ${inst.name}`);
    while (true) {
      if (this.insts.length > 0) {
        inst = this.insts[this.pc];
      }
      if (FuncMap[inst.name] != null) {
        let ret = (FuncMap[inst.name].bind(this))(engine, inst);
        if ((ret != null ? ret[Symbol.iterator] : undefined) != null) {
          yield* ret;
        }
      } else if (this.funcMap.get(inst.name) != null) {
        const func = this.funcMap.get(inst.name);
          this.insts = func.body;
          this.pc = -1;
          if (func.args != null) {
            let i = 0;
            for (let arg of Array.from(func.args)) {
              this.nameMap.local[arg] = inst.args[i];
              i++;
            }
          }
      } else {
        console.error(inst);
      }
      if ((this.insts.length === 0) || (this.insts.length - 1 <= this.pc)) {
        break;
      }
      this.pc++;
    }
  }
}
