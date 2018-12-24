//@flow
import { getFuncArgs } from '../main/funcMap'
import ComponentUtil from '../util/ComponentUtil'
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
      let children = [].concat(args[1])
      let classNames = [].concat(args[2])
      return { onClick, children, classNames }
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
      let defaultValue = args[0]
      let min = getFuncArgs(args, 1)
      let max = getFuncArgs(args, 2)
      let step = getFuncArgs(args, 3)
      let onChange = args[4]
      let attributes = getFuncArgs(args, 5)
      let classNames = [].concat(getFuncArgs(args, 6))

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
  StyledCheckboxInput: {
    path: '../components/input/StyledCheckboxInput',
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
  StyledRangeInput: {
    path: '../components/input/StyledRangeInput',
    getProps: (args: any[]) => {
      let defaultValue = args[0]
      let min = getFuncArgs(args, 1)
      let max = getFuncArgs(args, 2)
      let step = getFuncArgs(args, 3)
      let onChange = args[4]
      let attributes = getFuncArgs(args, 5)
      let classNames = [].concat(getFuncArgs(args, 6))

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
  RadioInput: {
    path: '../components/input/RadioInput',
    getProps: (args: any[]) => {
      let defaultValue = args[0]
      let selectList = args[1].map(select => {
        if (typeof select === 'object') {
          return {
            ...select,
            label: ComponentUtil.generateComponentState(select.label),
          }
        } else {
          return select
        }
      })
      let onChange = args[2]
      let attributes = getFuncArgs(args, 3)
      let classNames = [].concat(getFuncArgs(args, 4))

      return {
        defaultValue,
        selectList,
        onChange,
        attributes,
        classNames,
      }
    },
  },
  SelectInput: {
    path: '../components/input/SelectInput',
    getProps: (args: any[]) => {
      let defaultValue = args[0]
      let selectList = args[1]
      let onChange = args[2]
      let attributes = getFuncArgs(args, 3)
      let classNames = [].concat(getFuncArgs(args, 4))

      return {
        defaultValue,
        selectList,
        onChange,
        attributes,
        classNames,
      }
    },
  },
  Label: {
    path: '../components/input/Label',
    getProps: (args: any[]) => {
      const contexts = [].concat(args[0])
      let text =
        contexts
          .filter(
            context => typeof context !== 'object' || context.type !== 'func'
          )
          .reduce(text => {
            return engine.eval(text)
          }) || ''
      let children = contexts.filter(
        context => typeof context === 'object' && context.type === 'func'
      )
      let classNames = [].concat(getFuncArgs(args, 1))

      return {
        text,
        children,
        classNames,
      }
    },
  },
  SaveList: {
    path: '../containers/SaveList',
    getProps: (args: any[]) => {
      let onClick = args[0]
      let classNames = [].concat(args[1])
      let limit = args[2] || -1
      let offset = args[3] || 0
      return { classNames, onClick, limit, offset }
    },
  },
}
