start         = _* selector:Selector { return selector; }
              / .* { return []; }

_             = [ ]+
COMMA         = [,]

Selector      = el:Element _? COMMA? _? el2:Selector
                {
                  if (el2 instanceof Array) {
                    return [el,...el2];
                  } else {
                    return [el,el2];
                  }
                }
              / el:Element { return el; }

Element       = value:IdSelector
                {
                  return {
                    type: 'idSelector',
                    value
                  };
                }
              / value:ClassSelector
                {
                  return {
                    type: 'classSelector',
                    value
                  };
                }

ClassSelector = "." name:ClassName { return name; }
              / name:ClassName { return name; }

IdSelector    = "#" name:IdName { return name; }

ClassName     = name:$(![ \,\.#] .)+ { return name; }

IdName        = name:$([a-zA-Z][a-zA-Z0-9\-\_\:\.]*) { return name; }
