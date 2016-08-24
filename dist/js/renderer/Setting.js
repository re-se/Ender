var React, typeOf;

React = require('react');

typeOf = function(obj) {
  var type;
  type = Object.prototype.toString.call(obj).slice(8, -1);
  console.log(type);
  return type;
};

module.exports = React.createClass({
  genConfig: function(config, path) {
    var items, key, tr, v, value;
    if (path == null) {
      path = "";
    }
    items = [];
    for (key in config) {
      value = config[key];
      path = path + "/{key}";
      tr = [];
      tr.push(React.createElement("td", {
        "key": path + "-key"
      }, key));
      v = (function() {
        switch (typeOf(value)) {
          case "Boolean":
            return React.createElement("input", {
              "type": "checkbox"
            });
          default:
            return value;
        }
      })();
      tr.push(React.createElement("td", {
        "key": path + "-value"
      }, v));
      items.push(React.createElement("tr", {
        "key": path
      }, tr));
    }
    return React.createElement("table", null, React.createElement("tbody", null, items));
  },
  render: function() {
    return React.createElement("div", {
      "className": "setting",
      "onClick": this.onClick
    }, this.genConfig(this.props.config), React.createElement("div", {
      "className": "setting-cancel"
    }, "cancel"), React.createElement("div", {
      "className": "setting-save"
    }, "save"));
  }
});
