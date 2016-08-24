window.onload = function() {
  var Contents, Engine, HistoryView, ImageView, MessageBox, NameBox, React, ReactDOM, Setting, effects, fs, ipcRenderer, update;
  React = require('react');
  ReactDOM = require('react-dom');
  fs = require('fs');
  ipcRenderer = require('electron').ipcRenderer;
  update = require('react-addons-update');
  Engine = require('./js/renderer/engine');
  MessageBox = require('./js/renderer/MessageBox');
  NameBox = require('./js/renderer/NameBox');
  ImageView = require('./js/renderer/ImageView');
  HistoryView = require('./js/renderer/HistoryView');
  Setting = require('./js/renderer/Setting');
  effects = require('./js/renderer/effects');
  Contents = React.createClass({
    getInitialState: function() {
      return {
        mode: "main",
        message: null,
        images: [],
        refs: {},
        tls: null,
        config: {}
      };
    },
    componentDidMount: function() {
      var Action, config, filename;
      console.log("start!");
      config = JSON.parse(fs.readFileSync('dist/resource/config.json', 'utf8'));
      window.addEventListener("keydown", this.onKeyDown);
      window.addEventListener("wheel", this.onScroll);
      ipcRenderer.on('show-setting', (function(_this) {
        return function() {
          return _this.changeMode("setting");
        };
      })(this));
      Action = {
        setText: this.setText,
        setName: this.setName,
        setImage: this.setImage,
        clearImage: this.clearImage,
        clear: this.clear
      };
      filename = '01.end';
      this.engine = new Engine(filename, Action, config);
      return this.setState({
        config: config
      }, this.execAuto);
    },
    componentWillUnmount: function() {
      window.removeEventListener("keydown", this.onKeyDown);
      return window.removeEventListener("scroll", this.onScroll);
    },
    changeMode: function(mode) {
      var diff;
      if (mode !== "main") {
        diff = {};
        diff.auto = {
          $set: false
        };
        this.setConfig(diff);
      }
      return this.setState({
        mode: mode
      });
    },
    startAnimation: function(className, effectName, callback) {
      var cb, i, len, node, ref, results;
      this.tls = [];
      this.engine.startAnimation();
      cb = (function(_this) {
        return function() {
          if (typeof callback === "function") {
            callback();
          }
          _this.engine.finishAnimation();
          return _this.execAuto();
        };
      })(this);
      ref = document.getElementsByClassName(className);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        this.tls.push(effects[effectName](node, cb));
        results.push(cb = null);
      }
      return results;
    },
    finishAnimation: function(className) {
      var i, len, ref, tl;
      ref = this.tls;
      for (i = 0, len = ref.length; i < len; i++) {
        tl = ref[i];
        tl.progress(1, false);
      }
      this.tls = null;
      return this.engine.finishAnimation();
    },
    setText: function(message) {
      return this.setState({
        message: message
      });
    },
    setName: function(name) {
      return this.setState({
        name: name
      });
    },
    setImage: function(image) {
      var callback;
      if (image.effect != null) {
        callback = (function(_this) {
          return function() {
            return _this.startAnimation(image.className, image.effect);
          };
        })(this);
      } else {
        callback = (function(_this) {
          return function() {
            return _this.execAuto();
          };
        })(this);
      }
      return this.setState({
        images: this.state.images.concat(image)
      }, callback);
    },
    clearImage: function(target, effect) {
      var cb, i, image, images, len, ref;
      images = [];
      if (target != null) {
        ref = this.state.images;
        for (i = 0, len = ref.length; i < len; i++) {
          image = ref[i];
          if (image.className !== target) {
            images.push(image);
          }
        }
      }
      cb = (function(_this) {
        return function() {
          return _this.setState({
            images: images
          });
        };
      })(this);
      if (effect != null) {
        return this.startAnimation(target, effect, cb);
      }
    },
    clear: function() {
      return this.setState({
        message: null,
        images: []
      });
    },
    setConfig: function(diff) {
      var config, ref;
      config = update(this.state.config, diff);
      if ((ref = this.engine) != null) {
        ref.config = config;
      }
      return this.setState({
        config: config
      });
    },
    onClick: function() {
      var diff, ref;
      switch (this.state.mode) {
        case "main":
          if (this.state.history != null) {
            return this.setState({
              history: null
            });
          } else {
            diff = {};
            diff.auto = {
              $set: false
            };
            this.setConfig(diff);
            if (this.engine.isAnimated && (this.tls != null)) {
              return this.finishAnimation();
            } else {
              return (ref = this.engine) != null ? ref.exec() : void 0;
            }
          }
      }
    },
    onKeyDown: function(e) {
      switch (this.state.mode) {
        case "main":
          if (e.keyCode === 13) {
            return this.onClick();
          }
          break;
        case "setting":
          if (e.keyCode === 27) {
            return this.setState({
              mode: "main"
            });
          }
      }
    },
    onScroll: function(e) {
      var diff, ref;
      switch (this.state.mode) {
        case "main":
          if (e.deltaY < 0 && (this.state.history == null)) {
            diff = {};
            diff.auto = {
              $set: false
            };
            this.setConfig(diff);
            return this.setState({
              history: (ref = this.engine) != null ? ref.history : void 0
            });
          }
      }
    },
    execAuto: function() {
      if (this.state.config.auto) {
        return setTimeout((function(_this) {
          return function() {
            if (_this.state.config.auto) {
              return _this.engine.exec();
            }
          };
        })(this), this.state.config.autoSpeed);
      }
    },
    render: function() {
      var items;
      switch (this.state.mode) {
        case "main":
          items = [];
          if (this.state.name != null) {
            items.push(React.createElement(NameBox, {
              "key": "name",
              "name": this.state.name
            }));
          }
          if (this.state.history != null) {
            items.push(React.createElement(HistoryView, {
              "key": "history",
              "history": this.state.history
            }));
          }
          items.push(React.createElement(MessageBox, {
            "key": "message",
            "styles": "message-1",
            "message": this.state.message
          }));
          items.push(React.createElement(ImageView, {
            "key": "images",
            "images": this.state.images
          }));
          break;
        case "setting":
          items = React.createElement(Setting, {
            "key": "setting",
            "config": this.state.config
          });
      }
      return React.createElement("div", {
        "id": "inner",
        "onClick": this.onClick
      }, items);
    }
  });
  return ReactDOM.render(React.createElement(Contents, null), document.getElementById('contents'));
};
