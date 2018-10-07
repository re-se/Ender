import engine from '../main/engine'

type ArgDecl = {
  name: string,
  defaultValue?: any,
}

export default class Lambda {
  argDecls: ArgDecl[]
  body: Inst[]

  constructor(inst: LambdaInst) {
    this.argDecls = inst.args.map(arg => generateArgDecl(arg))
    this.body = inst.body
  }

  exec(args) {
    engine.callInsts(this.body)
    this.argDecls.forEach((argDecl, index) => {
      engine.declVar(argDecl.name, args[index] || argDecl.defaultValue)
    })
  }
}

function generateArgDecl(arg) {
  return {
    name: arg,
  }
}
