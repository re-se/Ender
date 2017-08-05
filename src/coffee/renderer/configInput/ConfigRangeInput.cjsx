React = require 'react'
{ConfigInput} = require './ConfigInput'

class @ConfigRangeInput extends ConfigInput
  constructor: (key, value, displayName, attrs) ->
    super(key, value, displayName, attrs)
    if !@attrs.step?
      @attrs.step = parseInt(@value / 10)

  # 設定画面の表示に使用するDOMを生成する
  genInputDom: (path, cl = "") ->
    doms = []
    # max より min の設定値が低い場合左右の反転処理を入れる
    if @attrs? and @attrs.max? and @attrs.min? and @attrs.max < @attrs.min
      doms.push <input key={path + "-input"} id={path + "-input"} className={"#{cl} input-range reverse-range"} type="range" defaultValue={@value} name={@key} step={Math.abs(@attrs.step)} max={@attrs.min} min={@attrs.max} list={if @attrs.list? then @attrs.list.key else undefined}/>
    else
      doms.push <input key={path + "-input"} id={path + "-input"} className={"#{cl} input-range"} type="range" defaultValue={@value} name={@key} step={@attrs.step} max={@attrs.max} min={@attrs.min} list={if @attrs.list? then @attrs.list.key else undefined}/>

    # list 属性の選択肢DOM作成
    if @attrs.list?
      optionDoms = []
      for value in @attrs.list.values then optionDoms.push <option value={value}/>
      doms.push <datalist id={@attrs.list.key} key={path + "-option/" + value}>{optionDoms}</datalist>
    return doms

  getType: () ->
    return "range"

  dup: ()->
    new ConfigRangeInput(@key, @value, @displayName, @attr)
