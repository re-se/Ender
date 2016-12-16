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
module.exports =
  "load": () =>
    extendingObject()
