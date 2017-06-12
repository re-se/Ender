React = require 'react'
module.exports = React.createClass
  render: () ->
    if @props.message?
      k = -1
      texts = []
      style = {}
      @props.message.forEach (m) ->
        k++
        item = switch m.type
          when "text"
            <span key={k} style={style}>{m.body}</span>
          when "strong"
            i = 0
            ru = ""
            while i++ < m.body.length
              ru += "﹅"
            <ruby key={k} style={style}><rb>{m.body}</rb><rt>{ru}</rt></ruby>
          when "br"
            <br key={k} style={style}/>
          when "marker"
            <span key={k} className="marker">{m.body}</span>
          when "ruby"
            <ruby key={k} style={style}><rb>{m.kanji}</rb><rt>{m.kana}</rt></ruby>
          when "style"
            style = m.value
            undefined
          else
            console.error m
        texts.push item if item?

      <div className="messageBox #{@props.styles}">
        <div className=".messageBox-inner">
          {texts}
        </div>
      </div>
    else
      <div>
      </div>
