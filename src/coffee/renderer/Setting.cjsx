React = require 'react'
{Button} = require './Button'
{Config} = require './Config'

typeOf = (obj) ->
  type = Object.prototype.toString.call(obj)[8...-1]
  console.log type
  type

module.exports = React.createClass
  genConfigView: (config, path="") ->
    items = []
    table = "table" if path is ""
    for key of config._config
      path = "#{path}/#{key}"
      tr = []
      tr.push <td key="#{path}-key">{key}</td>
      v = switch typeOf config[key]
        when "Boolean"
          <input type="checkbox" />
        when "Number"
          step = config[key] // 10
          if key is "Master" or key is "BGM" or key is "SE"
            <input type="range" step={step} defaultValue={config[key]} />
          else
            <input type="number" defaultValue={config[key]} step={step} />
        when "Object"
          switch typeOf config[key]._origin
            when "Array"
              <input type="range" max={config[key][2]} min={config[key][1]} step={config[key][3]} defaultValue={config[key][0]} />
            else
              @genConfigView(config[key], path)
        else
          config[key]
      tr.push <td key="#{path}-value">{v}</td>
      items.push <tr key={path}>{tr}</tr>
    <table ref={table}><tbody>{items}</tbody></table>

  genConfigJSON: (table = @refs.table) ->
    ret = {}
    for tr in table.querySelector("tbody").childNodes
      tds = tr.childNodes
      right = tds[1].childNodes[0]
      ret[tds[0].innerText] =
        switch right.tagName.toLowerCase()
          when "input"
            switch right.type
              when "checkbox" then right.checked
              when "number" then +right.value
              when "range" then +right.value
          when "table"
            v = @genConfigJSON right
            newv = {}
            for key, value of v
              newv["@#{key}"] = value
            new Config newv, false
          else
            console.log right
    ret

  onClick: (e) ->
    e.stopPropagation()
    json = @genConfigJSON()
    # @props.config.config = json
    @props.Action.setConfig json, null, true
    @props.Action.changeMode @props.prev
  render: ->
    <div className="settingView">
      {@genConfigView @props.config}
      <div className="setting-buttons">
        <Button classes="setting-cancel" onClick={=> @props.Action.changeMode @props.prev} inner="cancel" />
        <Button classes="setting-save" onClick={@onClick}inner="save" />
      </div>
    </div>
