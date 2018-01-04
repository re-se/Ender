export default {
  /* "コンポーネント名": [引数名の順番] */
  'Image': {
    'path': '../containers/Image',
    'getProps': (args) => {
      return {
        source: engine.eval(args[0]),
        classList: [].concat(engine.eval(args[1])),
        effect: engine.eval(args[2]),
        callback: () => {
          engine.exec()
        }
      }
    }
  },
  'MessageBox': {
    'path': '../containers/MessageBox',
    "getProps": (args) => {
      let classNames = [].concat(args[0])
      return { classNames }
    },
  },
  // Box(classNames? : string|Array, children...: object[])
  "Box": {
    "path": "../components/Box",
    "getProps": (args) => {
      let classNames = []
      if (typeof args[0] === 'string' || args[0] instanceof Array) {
        classNames.concat(args[0])
        args = args.slice(1)
      }
      return {
        classNames: classNames,
        children: args
      }
    }
  },
  "ExecButton": {
    "path": "../components/button/Button",
    "getProps": (args) => {
      let classNames = [].concat(args[0])
      return { classNames }
    },
  }
}
