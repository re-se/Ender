{ConfigInput} = require './ConfigInput'
{ConfigCheckboxInput} = require './ConfigCheckboxInput'
{ConfigNumberInput} = require './ConfigNumberInput'
{ConfigRangeInput} = require './ConfigRangeInput'

# ConfigInput を type 別にインスタンス生成する Factory クラス
class @ConfigInputFactory
  @create: (key, value, displayName, attrs, type) ->
    # type の指定がなければ value の型で type を決定
    if !type?
      type = switch typeOf value
        when "Number"
          "number"
        when "Boolean"
          "checkbox"
        else
          "text"

    # type で生成するインスタンスを分岐
    switch type
      when "number"
        new ConfigNumberInput key, value, displayName, attrs
      when "range"
        new ConfigRangeInput key, value, displayName, attrs
      when "checkbox"
        new ConfigCheckboxInput key, value, displayName, attrs
      else
        console.warn "not implemented ConfigInput class when type is #{type}"
