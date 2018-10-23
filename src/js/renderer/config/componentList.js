//@flow
import { getFuncArgs } from '../main/funcMap'
import { isVarInst, isLambdaInst } from '../util/inst'
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
  NumberInput: {
    path: '../components/input/NumberInput',
    getProps: (args: any[]) => {
      let defaultValue = args[0]
      let onChange = args[1]
      let attributes = getFuncArgs(args, 2)
      let classNames = [].concat(getFuncArgs(args, 3))
      return {
        defaultValue,
        onChange,
        attributes,
        classNames,
      }
    },
  },
  CheckboxInput: {
    path: '../components/input/CheckboxInput',
    getProps: (args: any[]) => {
      let defaultValue = args[0]
      let onChange = args[1]
      let attributes = getFuncArgs(args, 2)
      let classNames = [].concat(getFuncArgs(args, 3))
      return {
        defaultValue,
        onChange,
        attributes,
        classNames,
      }
    },
  },
  TextInput: {
    path: '../components/input/TextInput',
    getProps: (args: any[]) => {
      let defaultValue = args[0]
      let onChange = args[1]
      let attributes = getFuncArgs(args, 2)
      let classNames = [].concat(getFuncArgs(args, 3))
      return {
        defaultValue,
        onChange,
        attributes,
        classNames,
      }
    },
  },
  RangeInput: {
    path: '../components/input/RangeInput',
    getProps: (args: any[]) => {
      let argIndex = 0

      let defaultValue = args[argIndex]
      argIndex++

      let min
      if (!isLambdaInst(args[argIndex])) {
        min = engine.eval(args[argIndex])
        argIndex++
      }

      let max
      if (!isLambdaInst(args[argIndex])) {
        max = engine.eval(args[argIndex])
        argIndex++
      }

      let step
      if (!isLambdaInst(args[argIndex])) {
        step = engine.eval(args[argIndex])
        argIndex++
      }

      let onChange = args[argIndex]
      argIndex++

      let attributes = getFuncArgs(args, argIndex)
      argIndex++

      let classNames = [].concat(getFuncArgs(args, argIndex))

      return {
        defaultValue,
        min,
        max,
        step,
        onChange,
        attributes,
        classNames,
      }
    },
  },
}
