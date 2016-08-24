var React;

React = require('react');

module.exports = React.createClass({
  render: function() {
    var k, style, texts;
    if (this.props.message != null) {
      k = -1;
      texts = [];
      style = {};
      this.props.message.forEach(function(m) {
        var item;
        k++;
        item = (function() {
          switch (m.type) {
            case "text":
              return React.createElement("span", {
                "key": k,
                "style": style
              }, m.body);
            case "strong":
              return React.createElement("strong", {
                "key": k,
                "style": style
              }, m.body);
            case "br":
              return React.createElement("br", {
                "key": k,
                "style": style
              });
            case "marker":
              return React.createElement("span", {
                "key": k,
                "className": "marker"
              }, m.body);
            case "ruby":
              return React.createElement("ruby", {
                "key": k,
                "style": style
              }, React.createElement("rb", null, m.kanji), React.createElement("rt", null, m.kana));
            case "style":
              style = m.value;
              return void 0;
            default:
              return console.error(m);
          }
        })();
        if (item != null) {
          return texts.push(item);
        }
      });
      return React.createElement("div", {
        "className": this.props.styles
      }, texts);
    } else {
      return React.createElement("div", null);
    }
  }
});
