React = require 'react'
typeOf = (obj) ->
  type = Object.prototype.toString.call(obj)[8...-1]
  console.log type
  type

module.exports = React.createClass
  genConfig: (config, path="") ->
    items = []
    for key, value of config
      path = "#{path}/{key}"
      tr = []
      tr.push <td key="#{path}-key">{key}</td>
      v = switch typeOf value
        when "Boolean"
          <input type="checkbox" />
        else
          value
      tr.push <td key="#{path}-value">{v}</td>
      items.push <tr key={path}>{tr}</tr>
    <table><tbody>{items}</tbody></table>
  render: ->
    <div className="setting" onClick={@onClick}>
      {@genConfig @props.config}
      <div className="setting-cancel">cancel</div>
      <div className="setting-save">save</div>
    </div>
