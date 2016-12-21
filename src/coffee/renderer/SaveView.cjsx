React = require 'react'
{Button} = require './Button'


class @SaveView extends React.Component
  constructor: (props) ->
    super(props)
    @onClick = (id) =>
      () =>
        @setState selected: id
    @state = selected: 0
  render: ->
    id = 0
    saves = @props.saves.map (s) ->
      <Save key="save-#{s.thumbnail}" save={s}
        selected={id is @state.selected} onClick={@onClick(id)}/>
    while saves.length < 8
      saves.push <Save key="save-blank-#{id++}"
        selected={id is @state.selected} onClick={@onClick(id)}/>
    <div className="saveView">
      <div className="saveView-util">
        <Button inner="Save" />
      </div>
      {saves}
    </div>

class Save extends React.Component
  constructor: (props) ->
    super(props)
  render: ->
    classes = ["save-element"]
    classes.push "selected" if @props.selected
    classes = classes.concat @props.classes
    onClick = =>
      @props.onClick?()
    inner = <div className="save-thumbnail" />
    <Button classes={classes} inner={inner} onClick={onClick}>
    </Button>
