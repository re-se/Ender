export function isVarInst(value) {
  return typeof value === 'object' && value.type === 'var' && value.name
}

export function isLambdaInst(value) {
  return typeof value === 'object' && value.type === 'lambda' && value.body
}
