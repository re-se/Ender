React = require 'react'
{ConfigInput} = require './ConfigInput'

class @ConfigCheckboxInput extends ConfigInput
  constructor: (key, value, displayName, attrs) ->
    super(key, value, displayName, attrs)

  # 設定画面の表示に使用するDOMを生成する
  genInputDom: (path, cl) ->
    <input className={cl} type="checkbox" defaultChecked={@value} name={@key} key={path + "-input"} id={path + "-input"}/>

  getType: () ->
    return "checkbox"

  dup: ()->
    new ConfigCheckboxInput(@key, @value, @displayName, @attr)
