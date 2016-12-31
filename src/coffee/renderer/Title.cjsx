React = require 'react'
path = require 'path'

module.exports = React.createClass
  render: ->
    mainImgSrc = path.join @props.basePath, "image/title/title.png"
    <div className="title-view">
        <img key="title-main" className="title-main" src={mainImgSrc}/>
        <p key="title-start" className="title-button title-start" onClick={@start}> はじめから </p>
        <p key="title-continue" className="title-button title-continue" onClick={@continue}> つづきから </p>
        <p key="title-config" className="title-button title-config" onClick={@config}> 設定 </p>
    </div>
  start: () ->
    @props.Action.engineLoad()
    @props.Action.changeMode "main"
  continue: () ->
    @props.Action.changeMode "save"
  config: () ->
    @props.Action.changeMode "setting"
