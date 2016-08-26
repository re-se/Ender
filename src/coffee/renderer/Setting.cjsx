React = require 'react'
typeOf = (obj) ->
  type = Object.prototype.toString.call(obj)[8...-1]
  console.log type
  type

module.exports = React.createClass
  genConfigView: (config, path="") ->
    items = []
    table = "table" if path is ""
    for key, value of config.config
      path = "#{path}/{key}"
      tr = []
      tr.push <td key="#{path}-key">{key}</td>
      v = switch typeOf value
        when "Boolean"
          <input type="checkbox" />
        when "Number"
          step = value // 10
          <input type="number" defaultValue={value} step={step} />
        else
          value
      tr.push <td key="#{path}-value">{v}</td>
      items.push <tr key={path}>{tr}</tr>
    <table ref={table}><tbody>{items}</tbody></table>
  genConfigJSON: ->
    ret = {}
    for tr in @refs.table.querySelector("tbody").childNodes
      tds = tr.childNodes
      right = tds[1].childNodes[0]
      ret[tds[0].innerText] =
        switch right.tagName.toLowerCase()
          when "input"
            switch right.type
              when "checkbox" then right.checked
              when "number" then +right.value
          else
            console.log right
    ret

  onClick: (e) ->
    e.stopPropagation()
    json = @genConfigJSON()
    @props.config.config = json
    @props.Action.setConfig @props.config
    @props.Action.changeMode "main"
  render: ->
    <div className="setting">
      {@genConfigView @props.config}
      <div className="setting-cancel">cancel</div>
      <div className="setting-save" onClick={@onClick}>save</div>
    </div>
