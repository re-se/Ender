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
  Movie: {
    path: '../containers/Movie',
    getProps: (args: mixed[]) => {
      return {
        key: 'movie',
        src: getFuncArgs(args, 0),
        classNames: [].concat(getFuncArgs(args, 1, DEFAULT_IMAGE_CLASSNAME)),
        isLoop: getFuncArgs(args, 2),
        id: args[3],
        onEnded: args[4],
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
  History: {
    path: '../components/History',
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
  Button: {
    path: '../components/button/Button',
    getProps: args => {
      let onClick = args[0]
      let content = args[1]
      let classNames = [].concat(args[2])
      return { onClick, content, classNames }
    },
  },
  ExecButton: {
    path: '../components/button/Button',
    getProps: args => {
      let classNames = [].concat(args[0])
      return { classNames }
    },
  },
  StopAutoButton: {
    path: '../components/button/Button',
    getProps: args => {
      let classNames = [].concat(args[0])
      return { classNames }
    },
  },
  Text: {
    path: '../components/Text',
    getProps: args => {
      let text = args[0]
      let classNames = [].concat(args[1])
      return { text, classNames }
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
