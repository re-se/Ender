var React;

React = require('react');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "namebox-1"
    }, this.props.name);
  }
});
