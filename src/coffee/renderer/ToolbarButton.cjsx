React = require 'react'
{Button} = require './Button'

class @ToolbarButton extends React.Component
  constructor: (props) ->
    super(props)
  render: ->
    c = @props.type
    inner = [
      <i key="#{c}-button-icon" className="fa fa-#{@props.icon}" aria-hidden="true"/>,
      <span key="#{c}-button-text"> {@props.inner} </span>
    ]
    <Button inner={inner} classes={c} onClick={@props.onClick}/>
