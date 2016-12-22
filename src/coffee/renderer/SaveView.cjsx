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
      saves.push <Save key="save-#{id}" id={id}
        selected={id is @state.selected} onClick={@onClick(id)}/>
      id++
    for key, s of @props.saves
      saves[key] = <Save key="save-#{key}" id={key} save={s}
        selected={key is @state.selected} onClick={@onClick(key)}/>
    utils = []
    utils.push <Button key="save-util-save" inner="セーブ" onClick={=> @props.Action.save(@state.selected)}/>
    utils.push <Button key="save-util-load" inner="ロード" onClick={=> @props.Action.load(@state.selected)}/>
    utils.push <Button key="save-util-back" inner="戻る" onClick={=> @props.Action.changeMode("main")}/>

    <div className="saveView">
      <div className="saveView-util">
        {utils}
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
    if s.thumbnail?
      style =
        "backgroundImage": "url(data:image/png;base64.#{s.thumbnail}"
    inners.push <div key="save-#{@props.id}-thumbnail" className="save-thumbnail" style={style}/>
    date = if s.date? then (new Date(s.date)).format("yyyy/MM/dd hh:mm") else ""
    inners.push <div key="save-#{@props.id}-info" className="save-info">
        <div key="save-#{@props.id}-date" className="save-date"> {date} </div>
        <div key="save-#{@props.id}-text" className="save-text"> {s.text} </div>
      </div>
    <Button classes={classes} inner={inners} onClick={onClick}>
    </Button>
