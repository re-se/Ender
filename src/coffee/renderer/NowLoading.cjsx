React = require 'react'

class @NowLoading extends React.Component
  render: ->
    inner = []
    if @props.isVisible
      inner.push <span key="nowLoading-spinner-view-text"> Now loading... </span>
    <div className="nowLoading-spinner-view">
      {inner}
    </div>
