var React, ReactDOM;

React = require('react');

ReactDOM = require('react-dom');

module.exports = React.createClass({
  componentDidMount: function() {
    var t;
    t = ReactDOM.findDOMNode(this);
    if (t != null) {
      return t.scrollTop = t.scrollHeight;
    }
  },
  render: function() {
    return React.createElement("pre", {
      "className": "history-1"
    }, this.props.history);
  }
});
