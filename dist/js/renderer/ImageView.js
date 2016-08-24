var Image, React;

React = require('react');

Image = require('./Image');

module.exports = React.createClass({
  render: function() {
    var counts, items;
    counts = {};
    items = this.props.images.map((function(_this) {
      return function(image) {
        if (counts[image.src] != null) {
          counts[image.src] += 1;
        } else {
          counts[image.src] = 0;
        }
        return React.createElement(Image, {
          "image": image,
          "key": image.src + "-" + counts[image.src]
        });
      };
    })(this));
    return React.createElement("div", {
      "className": "images"
    }, items);
  }
});
