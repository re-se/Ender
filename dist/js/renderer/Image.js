var React;

React = require('react');

module.exports = React.createClass({
  componentDidMount: function() {},
  render: function() {
    var basePath, cl, image;
    basePath = "resource/";
    image = this.props.image;
    cl = image.className;
    if (!cl) {
      cl = "image-default";
    }
    return React.createElement("img", {
      "src": basePath + image.src,
      "className": cl,
      "ref": "image"
    });
  }
});
