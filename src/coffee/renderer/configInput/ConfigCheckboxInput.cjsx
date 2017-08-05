React = require 'react'
{ConfigInput} = require './ConfigInput'

class @ConfigCheckboxInput extends ConfigInput
  constructor: (key, value, displayName, attrs) ->
    super(key, value, displayName, attrs)

  # 設定画面の表示に使用するDOMを生成する
  genInputDom: (path, cl) ->
    <label key={path + "-label"}>
      <input className={"input-checkbox #{cl}"} type="checkbox" defaultChecked={@value} name={@key} key={path + "-input"} id={path + "-input"}/>
      <span key={path + "-parts"}></span>
    </label>

  getType: () ->
    return "checkbox"

  dup: ()->
    new ConfigCheckboxInput(@key, @value, @displayName, @attr)
