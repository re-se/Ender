React = require 'react'
{ConfigInput} = require './ConfigInput'

class @ConfigNumberInput extends ConfigInput
  constructor: (key, value, displayName, attrs) ->
    super(key, value, displayName, attrs)
    if !@attrs.step?
      @attrs.step = parseInt(@value / 10)

  # 設定画面の表示に使用するDOMを生成する
  genInputDom: (path, cl) ->
    doms = []
    doms.push <input className={cl} key={path + "-input"} id={path + "-input"} type="number" defaultValue={@value} name={@key} step={@attrs.step} max={@attrs.max} min={@attrs.min} list={if @attrs.list? then @attrs.list.key else undefined}/>
    # list 属性の選択肢DOM作成
    if @attrs.list?
      optionDoms = []
      for value in @attrs.lists.values then optionDoms.push <option value={value}/>
      doms.push <datalist id={@attrs.list.key} key={path + "-option/" + value}>{optionDoms}</datalist>
    return doms

  getType: () ->
    return "number"

  dup: ()->
    new ConfigNumberInput(@key, @value, @displayName, @attr)
