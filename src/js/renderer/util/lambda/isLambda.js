export function isLambda(inst: Inst): boolean {
  return inst instanceof Object && inst.type === 'lambda' && inst.body
}
