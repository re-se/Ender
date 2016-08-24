var Ender, fs, path,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

fs = require('fs');

path = require('path');

module.exports = Ender = (function() {
  function Ender(filename, Action, config) {
    this.filename = filename;
    this.Action = Action;
    this.config = config;
    this.exec = bind(this.exec, this);
    this._exec = bind(this._exec, this);
    this.parse();
    this.g = this._exec();
    this.history = "";
  }

  Ender.prototype.parse = function() {
    var parser;
    parser = require('../../../ender.js');
    this.basePath = path.resolve() + "/dist/resource/";
    this.script = fs.readFileSync(this.basePath + this.filename).toString();
    return this.insts = parser.parse(this.script);
  };

  Ender.prototype.finishAnimation = function() {
    return this.isAnimated = false;
  };

  Ender.prototype.startAnimation = function() {
    return this.isAnimated = true;
  };

  Ender.prototype.execAuto = function() {
    if (this.config.auto) {
      return setTimeout((function(_this) {
        return function() {
          if (_this.config.auto) {
            return _this.exec();
          }
        };
      })(this), this.config.autoSpeed);
    }
  };

  Ender.prototype.showMessage = function(currentMessage, nextMessage) {
    var cb, me;
    console.log(currentMessage);
    console.log(nextMessage);
    me = this.messageGen(currentMessage, nextMessage);
    if (this.config.textSpeed > 0) {
      this.isTextAnimated = true;
      cb = (function(_this) {
        return function() {
          var m;
          if ((m = me.next()).done) {
            _this.isTextAnimated = false;
            return _this.execAuto();
          } else {
            _this.Action.setText(m.value);
            return _this.timeoutID = setTimeout(cb, _this.config.textSpeed);
          }
        };
      })(this);
      return cb();
    } else {
      this.Action.setText(this.addEndMarker(currentMessage.concat(nextMessage)));
      return this.execAuto();
    }
  };

  Ender.prototype.clear = function(type, className, effect) {
    switch (type) {
      case "image":
        this.Action.clearImage(className, effect);
        return this.isAnimated = true;
      default:
        return console.error(type);
    }
  };

  Ender.prototype._exec = function*() {
    var className, currentMessage, effect, i, id, image, imagesMap, inst, k, l, len, len1, m, next, nextMessage, ref, ref1, style, type;
    this.isAnimated = false;
    this.isTextAnimated = false;
    currentMessage = [];
    nextMessage = [];
    imagesMap = {};
    style = {};
    ref = this.insts;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      inst = ref[i];
      console.log(inst.type);
      next = this.insts[i + 1];
      switch (inst.type) {
        case "wait":
          this.endMarker = (next != null ? next.type : void 0) === "clear" ? "▼" : "▽";
          this.showMessage(currentMessage, nextMessage);
          (yield 0);
          currentMessage = currentMessage.concat(nextMessage);
          nextMessage = [];
          if (this.isTextAnimated) {
            clearTimeout(this.timeoutID);
            this.Action.setText(this.addEndMarker(currentMessage));
            (yield 0);
          }
          break;
        case "text":
          ref1 = inst.value;
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            m = ref1[l];
            if (m.body != null) {
              this.history += m.body;
            }
            if (m.type === "br") {
              this.history += "\n";
            }
          }
          nextMessage = nextMessage.concat(inst.value);
          break;
        case "name":
          this.Action.setName(inst.name);
          this.history += inst.name + "「";
          break;
        case "nameClear":
          this.Action.setName(null);
          this.history += "」\n";
          break;
        case "clear":
          if (inst.message) {
            currentMessage = [];
            nextMessage = [];
            this.Action.setText(currentMessage);
          }
          if (inst.image) {
            this.Action.clearImage(inst.target, inst.effect);
            this.isAnimated = true;
            while (this.isAnimated) {
              (yield 0);
            }
          }
          break;
        case "func":
          console.log("func: " + inst.name);
          switch (inst.name) {
            case "img":
              image = {};
              image.src = inst.args[0];
              image.className = inst.args[1];
              image.effect = inst.args[2];
              id = this.Action.setImage(image);
              if (image.effect != null) {
                while (this.isAnimated) {
                  (yield 0);
                }
              } else {
                (yield 0);
              }
              break;
            case "style":
              style = Object.assign({}, style, inst.args[0]);
              nextMessage.push({
                type: "style",
                value: style
              });
              break;
            case "clear":
              type = inst.args[0];
              className = inst.args[1];
              effect = inst.args[2];
              this.clear(type, className, effect);
              while (this.isAnimated) {
                (yield 0);
              }
              break;
            default:
              console.error(inst);
          }
          break;
        default:
          console.error(inst);
      }
    }
    this.Action.clear();
    this.history = "";
    return this.g = this._exec();
  };

  Ender.prototype.exec = function() {
    return this.g.next();
  };

  Ender.prototype.addEndMarker = function(message, isNewPage) {
    var endMarker, last;
    endMarker = {
      type: "marker"
    };
    endMarker.body = this.endMarker;
    last = message[message.length - 1];
    if (last.type === "br") {
      return message.slice(0, +(message.length - 2) + 1 || 9e9).concat(endMarker, last);
    } else {
      return message.concat(endMarker);
    }
  };

  Ender.prototype.messageGen = function*(before, message) {
    var cur, i, j, k, len, m;
    i = 0;
    for (k = 0, len = message.length; k < len; k++) {
      m = message[k];
      cur = {};
      cur.type = m.type;
      j = 1;
      if (m.body != null) {
        while (j <= m.body.length) {
          cur.body = m.body.substr(0, j);
          (yield before.concat(message.slice(0, i), cur));
          j++;
        }
      }
      i++;
    }
    return (yield this.addEndMarker(before.concat(message)));
  };

  return Ender;

})();
