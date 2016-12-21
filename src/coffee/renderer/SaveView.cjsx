React = require 'react'
{Button} = require './Button'

class @SaveView extends React.Component
  constructor: (props) ->
    super(props)
    @state = selected: 0
  onClick: (id) ->
    () =>
      @setState selected: id
  render: ->
    id = 0
    saves = []
    while saves.length < 8
      saves.push <Save key="save-#{id}"
        selected={id is @state.selected} onClick={@onClick(id)}/>
      id++
    for key, s of @props.saves
      saves[key] = <Save key="save-#{key}" save={s}
        selected={key is @state.selected} onClick={@onClick(key)}/>
    <div className="saveView">
      <div className="saveView-util">
        <Button inner="Save" onClick={=> @props.Action.save(@state.selected)}/>
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
    inners = []
    s = if @props.save? then @props.save else {}
    style =
      "background-image": "url(data:image/png;base64.#{s.thumbnail}"
    inners.push <div className="save-thumbnail" style={style}/>
    date = if s.date? then (new Date(s.date)).format("yyyy/MM/dd hh:mm") else ""
    inners.push <div className="save-info">
        <div className="save-date"> {date} </div>
        <div className="save-text"> {s.text} </div>
      </div>
    <Button classes={classes} inner={inners} onClick={onClick}>
    </Button>
