React = require 'react'
{Button} = require './Button'
{Config} = require './Config'
{ConfigInput} = require './configInput/ConfigInput'

typeOf = (obj) ->
  type = Object.prototype.toString.call(obj)[8...-1]
  type

module.exports = React.createClass
  genConfigView: (config, path="") ->
    items = []
    table = "table" if path is ""
    config.forEachPublicOnly (key, value) =>
      currentPath = "#{path}/#{key}"
      tr = []
      tr.push <td key="#{currentPath}-key">{key}</td>
      v = if config.getConfigInput(key)?
        config.getConfigInput(key).genInputDom(currentPath)
      else if value instanceof Config
        @genConfigView(value, currentPath)
      tr.push <td key="#{currentPath}-value">{v}</td>
      items.push <tr key={currentPath}>{tr}</tr>
    <table ref={table}><tbody>{items}</tbody></table>

  genConfigJSON: (config, path, table = @refs.table) ->
    ret = {}

    config.forEachPublicOnly (key, value) =>
      currentPath = "#{path}/#{key}"
      if config.getConfigInput(key)?
        ret[key] = @getInputValue(currentPath)
      else if value instanceof Config
        json = @genConfigJSON value, currentPath
        ret[key] = json

    # for tr in table.querySelector("tbody").childNodes
    #   tds = tr.childNodes
    #   right = tds[1].childNodes[0]
    #   ret[tds[0].innerText] =
    #     switch right.tagName.toLowerCase()
    #       when "input"
    #         switch right.type
    #           when "checkbox" then right.checked
    #           when "number" then +right.value
    #           when "range" then +right.value
    #       when "table"
    #         v = @genConfigJSON config, right
    #         newv = {}
    #         for key, value of v
    #           newv["@#{key}"] = value
    #         new Config newv, false
    #       else
    #         console.log right
    ret

  getInputValue: (id) ->
    inputDom = document.getElementById("#{id}-input")
    value = switch inputDom.type
      when "checkbox" then inputDom.checked
      when "number" then +inputDom.value
      when "range" then +inputDom.value

  onClick: (e) ->
    e.stopPropagation()
    json = @genConfigJSON(@props.config, "")
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
