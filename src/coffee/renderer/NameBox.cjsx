React = require 'react'
module.exports = React.createClass
  render: () ->
    <div className="namebox-1">
      {@props.name}
    </div>
