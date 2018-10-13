type ArgDecl = {
  name: string,
  defaultValue?: any,
}

export function generateArgDecl(arg): ArgDecl {
  return {
    name: arg,
  }
}
