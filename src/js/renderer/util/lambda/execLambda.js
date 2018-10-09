import engine from '../../main/engine'
import { generateArgDecl } from './generateArgDecl'

export function execLambda(lambdaInst, args) {
  engine.callInsts(lambdaInst.body)

  const argDecls = lambdaInst.args.map(arg => generateArgDecl(arg))
  argDecls.forEach((argDecl, index) => {
    engine.declVar(argDecl.name, args[index] || argDecl.defaultValue)
  })
}
