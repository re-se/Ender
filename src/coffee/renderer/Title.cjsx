React = require 'react'
path = require 'path'

module.exports = React.createClass
  componentDidMount: ->

  render: ->
    mainImgSrc = path.join @props.basePath, "image/title/titleimg.png"
    logoImgSrc = path.join @props.basePath, "image/title/titlelogo.png"
    <div className="title-view" key="title-view-inner">
      <img key="title-main2" className="title-main title-img-main" src={mainImgSrc}/>
      <img key="title-main1" className="title-main title-img-logo" src={logoImgSrc}/>
      <div className="title-buttons">
        <div key="title-start-wrapper" className="title-button-wrapper">
          <p key="title-start" className="title-button title-start" onClick={@start}/>
          <span key="title-start-bar" className=""/>
        </div>
        <div key="title-continue-wrapper" className="title-button-wrapper">
          <p key="title-continue" className="title-button title-continue" onClick={@continue}/>
          <span key="title-continue-bar" className=""/>
        </div>
        <div key="title-config-wrapper" className="title-button-wrapper">
          <p key="title-config" className="title-button title-config" onClick={@config}/>
          <span key="title-config-bar" className=""/>
        </div>
      </div>
    </div>
  start: () ->
    @props.Action.engineLoad()
    @props.Action.changeMode "main"
  continue: () ->
    @props.Action.changeMode "save"
  config: () ->
    @props.Action.changeMode "setting"
