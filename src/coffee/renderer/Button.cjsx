React = require 'react'

class @Button extends React.Component
  constructor: (props) ->
    super(props)
  render: ->
    classes = ["button"]
    classes = classes.concat @props.classes
    <div className={classes.join " "} onClick={@props.onClick}>
      {@props.inner}
    </div>
