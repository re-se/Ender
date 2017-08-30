# Config の公開プロパティの抽象クラス
# 設定画面での入力フォーマットに応じたパラメータを持つ
class @ConfigInput
  constructor: (@key, @value, @displayName, @attrs) ->
    if !@attrs?
      @attrs = {}

  # 設定画面の表示に使用するDOMを生成する
  # 抽象メソッド
  genInputDom: () ->
    console.warn ("genInputDom of Abstract must be overridden")

  getConfigJson: () ->
    return {
      "$value": @value,
      "displayName": @displayName,
      "type": @getType(),
      "attrs": @attrs
    }

  getType: () ->
    console.warn ("getType of Abstract must be overridden")

  dup: () ->
    console.warn ("dup of Abstract must be overridden")

  toString: (space = "") ->
    JSON.stringify @getConfigJson, null, space
