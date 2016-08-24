React = require 'react'
ReactDOM = require 'react-dom'
module.exports = React.createClass
  componentDidMount: ->
    t = ReactDOM.findDOMNode(@)
    t.scrollTop = t.scrollHeight if t?
  render: () ->
    <pre className="history-1">{@props.history}</pre>
