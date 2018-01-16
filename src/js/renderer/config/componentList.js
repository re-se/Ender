//@flow
import {getFuncArgs} from '../main/funcMap'

/** デフォルトの画像のクラス名 */
const DEFAULT_IMAGE_CLASSNAME = 'image-default'

export default {
  /* "コンポーネント名": [引数名の順番] */
  'Image': {
    'path': '../containers/Image',
    'getProps': (args: any[]) => {
      return {
        key: 'image',
        src: getFuncArgs(args, 0),
        classList: [].concat(getFuncArgs(args, 1, DEFAULT_IMAGE_CLASSNAME)),
        effect: getFuncArgs(args, 2)
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
