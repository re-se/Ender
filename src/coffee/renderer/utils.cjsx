extendingObject = () ->
  window.Object.defineProperty Object.prototype,
  "forIn",
  "value": (func, self) ->
    self = self || @
    res = []
    Object.keys(@).forEach (key, index) ->
      value = @[key]
      res.push func.call(self, key, value, index)
    , @
    res
  window.Object.defineProperty Date.prototype, "format",
    get: -> (format) ->
      f = format
      f = 'yyyy-MM-dd_hh-mm-ss' unless f?
      week = ["日","月","火","水","木","金","土"]
      f = f.replace(/yyyy/g, @getFullYear())
      f = f.replace(/MM/g, ('0' + (@getMonth() + 1)).slice(-2))
      f = f.replace(/hh/g, ('0' + @getHours()).slice(-2))
      f = f.replace(/mm/g, ('0' + @getMinutes()).slice(-2))
      f = f.replace(/ss/g, ('0' + @getSeconds()).slice(-2))
      f = f.replace(/ddddd/g, week[@getDay()] + "曜日")
      f = f.replace(/dddd/g, week[@getDay()] + "曜")
      f = f.replace(/ddd/g, week[@getDay()])
      f = f.replace(/dd/g, ('0' + @getDate()).slice(-2))
      f
  window.typeOf = (obj) ->
    type = Object.prototype.toString.call(obj)[8...-1]
    type
module.exports =
  "load": () =>
    extendingObject()
