// @flow
import fs from 'fs';
import path from 'path';
import FuncEngine from './func';
import { Config } from './Config';
import parser from './ender.js';

export default class Ender {
  pc: number;
  insts: Array<Inst>;
  config: Config;
  endMarker: string;
  constructor(Action, config) {
    this._exec = this._exec.bind(this);
    this.exec = this.exec.bind(this);
    this.Action = Action;
    this.config = config;
    this.insts = [];
    this.pc = 0;
    this.fe = new FuncEngine(this.Action);
    this.load(this.config.main);
  }

  load(filename, cb) {
    this.filename = filename;
    this.parse();
    this.pc = 0;
    this.g = this._exec();
    this.clearAll(cb);
  }

  reload : (filename: string, cb: Function) => void;
  reload : (filename: Function) => void;
  reload(filename, cb) {
    if (typeof filename !== "string") {
      cb = filename;
      ({ filename } = this);
    }
    this.insts = [];
    this.pc = 0;
    this.load(filename, cb);
  }

  parse() {
    let textPath = this.config.text.path;
    if (textPath == null) { textPath = ""; }
    const mainPath = path.join(this.config.basePath, textPath, this.filename);
    const script = fs.readFileSync(mainPath).toString();
    return this.insts = parser.parse(script).concat(this.insts.slice(this.pc+1));
  }

  getCurrentState() {
    return [this.filename, this.pc];
  }

  setCurrentState(filename, pc, cb) {
    return this.reload(filename, () => {
      return this.skip(pc, cb);
    });
  }

  skip(pc, cb) {
    if (this.isSkip) { return; }
    this.isSkip = true;
    let _g = this.g;
    let callback = () => {
      this.isSkip = false;
      return cb();
    };
    this.g = this._skip(_g, pc, callback);
    return this.exec();
  }

  *_skip(_g, pc, cb) {
    let { textSpeed } = this.config;
    this.Action.setConfig("textSpeed", 0);
    let audioVolume = this.config.volume.Master;
    let muteVolume = this.config.volume;
    muteVolume.Master = 0;
    this.Action.setConfig("volume", muteVolume);
    console.log(this.config);
    while ((this.pc < pc) || this.config.skip) {
      let ret = _g.next();
      console.log(ret);
      if (ret.value === "async") {
        yield 0;
      }
    }
    muteVolume.Master = audioVolume;
    this.Action.setConfig("volume", muteVolume);
    this.Action.setConfig("textSpeed", textSpeed);
    this.g = _g;
    if (cb != null) {
      return cb();
    }
  }

  finishAnimation() {
    this.isAnimated = false;
  }

  startAnimation() {
    this.isAnimated = true;
  }

  finishLoad() {
    this.isLoaded = false;
  }

  startLoad() {
    this.isLoaded = true;
  }

  changeStyle(style) {
    this.style = Object.assign({}, this.style, style);
    this.addMessage({type: "style", value: this.style});
  }

  addMessage(message) {
    this.nextMessage.push(message);
  }

  showMessage(currentMessage, nextMessage) {
    let me = this.messageGen(this.currentMessage, this.nextMessage);
    if (this.config.textSpeed > 0) {
      this.isTextAnimated = true;
      var cb = () => {
        let m;
        if ((m = me.next()).done) {
          this.isTextAnimated = false;
          return this.autoExec();
        } else {
          this.Action.setText(m.value);
          return this.timeoutID = setTimeout(cb, this.config.textSpeed);
        }
      };
      return cb();
    } else {
      return this.Action.setText(this.addEndMarker(this.currentMessage.concat(this.nextMessage)), () => this.autoExec());
    }
  }

  clear(type, className, effect, cb) {
    switch (type) {
      case "text":
        this.currentMessage = [];
        this.nextMessage = [];
        return this.Action.clear("text", cb);
      case "image":
        return this.Action.clearImage(className, effect, cb);
      default:
        this.currentMessage = [];
        this.nextMessage = [];
        this.history = "";
        cb = type;
        return this.Action.clear(cb);
    }
  }

  clearAll(cb) {
    this.history = "";
    return this.clear(cb);
  }

  *_exec() {
    this.isAnimated = false;
    this.isTextAnimated = false;
    this.isLoaded = false;
    this.style = {};
    let imagesMap = {};
    this.pc = 0;
    while (true) {
      let inst = this.insts[this.pc];
      let next = this.insts[this.pc+1];
      if (inst != null) {
        var ret;
        console.log(inst.type);
        switch (inst.type) {
          case "wait":
            this.endMarker = (next != null ? next.type : undefined) === "clear" ? "▼" : "▽";
            this.showMessage();
            yield 0;
            this.currentMessage = this.currentMessage.concat(this.nextMessage);
            this.nextMessage = [];
            if (this.isTextAnimated) {
              clearTimeout(this.timeoutID);
              this.Action.setText(this.addEndMarker(this.currentMessage));
              this.isTextAnimated = false;
              yield 0;
            }
            break;
          case "text":
            for (let m of Array.from(inst.value)) {
              if (m.type === "interpolation") {
                m.type = "text";
                m.body = this.fe.getVar(m.expr);
              }
              if (m.body != null) { this.history += m.body; }
              if (m.type === "br") { this.history += "\n"; }
            }
            this.nextMessage = this.nextMessage.concat(inst.value);
            break;
          case "name":
            this.currentMessage = [];
            this.nextMessage = [];
            let { name } = inst;
            if ((name.length < 1) && (this.config.text.defaultName != null)) {
              name = this.config.text.defaultName;
            }
            this.Action.setName(name);
            this.history += `${name}「`;
            break;
          case "nameClear":
            this.Action.setName(null);
            this.history += "」\n";
            break;
          // when "br"
          //   message = message.concat type: "br"
          case "clear":
            if (inst.message) {
              this.clear("text", () => {
                return this.Action.setText(this.currentMessage);
              }
              );
            } else {
              console.error(inst);
            }
            break;
              // @history += "\n"
            // if inst.image
            //   console.error "wawawa"
            //   console.dir inst
            //   @Action.clearImage(inst.target, inst.effect, @exec)
            //   @startAnimation()
            //   loop
            //     yield "async"
            //     break if not @isAnimated
          case "funcdecl":
            this.fe.addFunc(inst);
            break;
          case "func":
            let it = this.fe.exec(this);
            while (!(ret = it.next()).done) {
              yield ret.value;
            }
            break;
          default:
            console.error(inst);
        }
      }
      this.pc++;
      if (this.insts.length < this.pc) { break; }
    }

    this.clearAll();
    return this.g = this._exec();
  }

  exec() {
    try {
      let ret = this.g.next();
      return this.isAsync = ret.value === "async";
    } catch (error) {
      console.error(error);
    }
  }

  autoExec() {
    if (this.config.auto && !this.isAsync) {
      setTimeout(() => {
        if (this.config.auto && !this.isAsync) {
          return this.exec();
        }
      }, this.config.autoSpeed);
    }
  }


  addEndMarker(message, isNewPage) {
    let endMarker = {type: "marker"};
    endMarker.body = this.endMarker;
    let last = message[message.length - 1];
    if (last.type === "br") {
      return message.slice(0, message.length - 2 + 1 || undefined).concat(endMarker, last);
    } else {
      return message.concat(endMarker);
    }
  }

  *messageGen(before, message) {
    let i = 0;
    for (let m of Array.from(message)) {
      let cur = {};
      cur.type = m.type;
      let j = 1;
      if (m.body != null) {
        while (j <= m.body.length) {
          cur.body = m.body.substr(0, j);
          yield before.concat(message.slice(0, i), cur);
          j++;
        }
      }
      i++;
    }
    yield this.addEndMarker(before.concat(message));
  }
};

module.exports = Ender;
