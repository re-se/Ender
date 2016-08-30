 {
   function genObj(type) {
      return {type: type};
   }

   function genClear(type) {
     var o = genObj("clear");
     o[type] = true;
     return o;
   }

   function genText(body) {
     var o = genObj("text");
     o.body = body;
     return o;
   }

   function genRuby(kanji, kana) {
     var o = genObj("ruby");
     o.body = kanji;
     o.kanji = kanji;
     o.kana = kana;
     return o;
   }

   function genName(name) {
     var o = genObj("name");
     o.name = name;
     return o;
   }

   function genVar(name) {
     var o = genObj("var");
     o.name = name;
     return o;
   }

   function genFunc(name, args) {
     var o = genObj("func");
     o.name = name;
     o.args = args;
     return o;
   }

   function genFuncDecl(name, args, body) {
     var o = genObj("funcdecl");
     o.name = name;
     o.args = args;
     o.body = body;
     return o;
   }

   function toStr(arr) {
     return arr.map(function(l) {
       return l[1];
     }).join("");
   }
 }

 FIle = lines:(_ Line)* __ {
   var ret = [];
   for(var i = 0; i < lines.length; i++) {
     ret = ret.concat(lines[i][1]);
   }
   return ret;
}

S = [ \t]
NL = '\r'? '\n'
_ = S*
__ = (S / NL)*

Line
  = Comment
  / Say
  / FuncDecl
  / Function
  / Text
  / Br

Comment = "#" (!NL .)* NL { return null; }

Say = name:(!(NL / "「") .)* "「" lines:(Function / Text)* "」" {
  name = toStr(name);
  lines = Array.prototype.concat.apply([], lines);
  return Array.prototype.concat.apply([], [genName(name), lines, genObj("wait"), genObj("nameClear")]);
}

FuncDecl = "func" _ name:Name _ args:FuncArgs _ "{" lines:(__ !"}" Line)* __ "}" NL? {
  var body = [];
   for(var i = 0; i < lines.length; i++) {
     body = body.concat(lines[i][2]);
   }
   return genFuncDecl(name, args, body);
}

FuncArgs = "(" _ arg1:(Name / Null) arg2:(_ "," _ Name)*  _ ")" {
  var arg;
  if (arg1 || arg2.length > 0) {
    arg = [arg1];
  }
  if(arg2.length > 0) {
    var ar = arg2.map(function(a) {
      return a[3];
    });
    arg = arg.concat(ar);
  }
  return arg;
}



Text = value:(Element)+ nl:(NL)? at:("@")? {
  if(nl) {
    value = value.concat(genObj("br"));
  }
  var ret = {type:"text", value: value};
  if(nl || at) {
    return [ret, genObj("wait")];
  }
  return ret;
}

Element
  = Ruby
  / "\\" "\n" { return genObj("br"); }
  / SimpleText

Ruby = "{" kanji:(!(NL / "|" / "}") .)+ "|" kana:(!(NL / "}") .)+  "}" {
	return genRuby(toStr(kanji), toStr(kana));
}

Escape = "\\" [「」{}@\\]

SimpleText = line:(Escape / !(NL / "」" / "{" / "@" / "\\") .)+ {
   return genText(toStr(line));
 }

Br = NL+ { return genClear("message"); }

Function
  = "\\" name:Name args:Args? {
  return genFunc(name, args);
}

Name = name:([a-zA-Z] [a-zA-Z0-9\-]*) { return name[0] + name[1].join(""); }

Args = "(" _ arg1:Arg arg2:(_ "," _ Arg)*  _ ")" {
  var arg;
  if (arg1 || arg2.length > 0) {
    arg = [arg1];
  }
  if(arg2.length > 0) {
    var ar = arg2.map(function(a) {
      return a[3];
    });
    arg = arg.concat(ar);
  }
  return arg;
}

Arg = Object / String / Number / Var / Null

Var = name:Name { return genVar(name) }

Null = '' { return null; }

Object = _Object / SimpleObject

_Object = "{" props: (_ Property _ ","?)* _ "}" {
  var obj = {};
  if (props) {
    props.forEach(function(p) {
      p = p[1];
      obj[p[0]] = p[1];
    });
  }
  return obj;
}

SimpleObject = p:Property  {
  var obj = {};
  obj[p[0]] = p[1];
  return obj;
}

Property = k:(Name / String) _ ":" _ v:Arg {
  return [k, v]
}

String = '"' str:(!'"' .)* '"' {
  return toStr(str);
}

Number = d:[0-9]+ f:("." [0-9]*)? {
  var n = d.join("");
  if(f) {
    n += "." + f[1].join("");
  }
  return parseFloat(n);
}
