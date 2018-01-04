export default {
  /* "コンポーネント名": [引数名の順番] */
  'Image': {
    'path': '../containers/Image'
  },
  'MessageBox': {
    'path': '../containers/MessageBox',
    'args': ['classNames'],
  },
  // Box(classNames? : string|Array, children...: any[])
  "Box": {
    "path": "../components/Box",
    "args": ["children..."],
  },
  "ExecButton": {
    'path': '../components/button/Button',
    'args': ['classNames'],
  }
}
