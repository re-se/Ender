//@flow
import { getFuncArgs } from '../main/funcMap'
import engine from '../main/engine'

/** デフォルトの画像のクラス名 */
const DEFAULT_IMAGE_CLASSNAME = 'image-default'

export default {
  /* "コンポーネント名": [引数名の順番] */
  Image: {
    path: '../containers/Image',
    getProps: (args: mixed[]) => {
      return {
        key: 'image',
        src: getFuncArgs(args, 0),
        classNames: [].concat(getFuncArgs(args, 1, DEFAULT_IMAGE_CLASSNAME)),
        effect: getFuncArgs(args, 2),
        id: args[3],
      }
    },
  },
  MessageBox: {
    path: '../containers/MessageBox',
    getProps: args => {
      let classNames = [].concat(args[0])
      return { classNames }
    },
  },
  // Box(classNames? : string|Array, children...: object[])
  Box: {
    path: '../components/Box',
    getProps: args => {
      let classNames = []
      if (typeof args[0] === 'string' || args[0] instanceof Array) {
        classNames = classNames.concat(engine.eval(args[0]))
        args = args.slice(1)
      }
      return {
        classNames: classNames,
        children: args,
      }
    },
  },
  ExecButton: {
    path: '../components/button/Button',
    getProps: args => {
      let classNames = [].concat(args[0])
      return { classNames }
    },
  },
  Style: {
    path: '../components/Style',
    getProps: args => {
      let style = args[0]
      return { style }
    },
  },
}
