module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true,
  },
  "plugins": [
    "react",
    "flowtype",
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
    },
  },
  "rules": {
    "semi": ["warn", "never"],
    "indent": ["error", 2, {"SwitchCase": 1}],
    "flowtype/define-flow-type": 1,
    "flowtype/use-flow-type": 1,
  }
}
