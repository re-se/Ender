{
  function genObj(type) {
    return {type: type};
  }

  function genComment(body) {
    var o = genObj("comment");
    o.body = body;
    return o;
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

  function genEnphasize(text) {
    var o = genObj("strong");
    o.body = text;
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

  function genInterpolation(expr) {
    var o = genObj("interpolation");
    o.expr = expr;
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
EOL = NL / EOF
EOF = !.
_ = S*
__ = (S / NL)*

Line
  = Comment
  / Say
  / FuncDecl
  / VarDecl
  / Call
  / Text
  / Br

Comment = "#" c:((!NL .)*) NL { return genComment(toStr(c)); }

Say = name:(Escape / !(NL / "「") .)* !KP "「" lines:(Call / Text / Br)* "」" {
  name = toStr(name);
  lines = Array.prototype.concat.apply([], lines);
  return Array.prototype.concat.apply([], [genName(name), lines, genObj("wait"), genObj("nameClear")]);
}

KP = "「" (KP / !"」" .)* "」" !EOL

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

Text = value:(Element)+ nl:(NL / &"#")? at:("@")? {
  // flatten
  value = Array.prototype.concat.apply([], value)
  if(nl) {
    value = value.concat(genObj("br"));
  }
  var ret = [{type:"text", value: value}];
  if(nl || at) {
    ret.push(genObj("wait"));
  }
  return ret;
}

PERIOD = $("。")+

Period = p: $PERIOD {
  return [genText(p), genObj("period")]
}

Element
  = Interpolation
  / Ruby
  / "\\" NL { return genObj("br"); }
  / Enphasize
  / Period
  / SimpleText

Interpolation = "${" _ t:Expr _ "}" {
  return genInterpolation(t);
}

Ruby = "{" kanji:(!(NL / "|" / "}") .)+ "|" kana:(!(NL / "}") .)+  "}" {
  return genRuby(toStr(kanji), toStr(kana));
}

Escape = "\\" w:[「」{}@\\#*] {return w } / p:PERIOD "\\" {return p }

SimpleText = line:(Escape / $(!(NL / "」" EOL / Ruby / "${" / "@" / "\\" / "#"/ "*" / PERIOD) .))+ {
  return genText(line.join(''));
 }

Enphasize = "*" text:(!("*") .)+ "*" {
  return genEnphasize(toStr(text));
}

Br = NL+ { return genClear("message"); }

Call
  = "\\" name:Name args:Args? {
  return genFunc(name, args);
}

VarDecl = t:Assignable _ "=" _ right:Expr EOL {
  return genFunc("set", [t, right]);
}


Assignable = a:$(Identifier (Accessor)*) {
  return a;
}

Accessor
  = "." (Identifier)
  / "[" (Expr) "]"

Identifier = Name

Name = name:([a-zA-Z_] [a-zA-Z0-9_]*) { return name[0] + name[1].join(""); }

Args = "(" __ arg1:Expr arg2:(__ "," __ Expr)*  __ ")" {
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

Expr = Call / Object / Array / String / Number / Bool / Var / Null

Var = name:Assignable { return genVar(name) }

Bool = b:("true" / "false") {
  if(b === "true") {
    return true;
  }
  return false;
}

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

Property = k:(Name / String / Number) _ ":" _ v:Expr {
  return [k, v]
}

Array = "[" e1:(_ Expr _ ",")* e2:(_ Expr)? _ "]" {
  return [].concat(e1.map((e) => {
    return e[1]
  })).concat(e2[1] || [])
}

String = SingleQuoted / DoubleQuoted

DoubleQuoted = '"' str:(!'"' .)* '"'  {
  return toStr(str);
}

SingleQuoted = "'" str:(!"'" .)* "'"  {
  return toStr(str);
}

Number = d:[0-9]+ f:("." [0-9]*)? {
  var n = d.join("");
  if(f) {
    n += "." + f[1].join("");
  }
  return parseFloat(n);
}
