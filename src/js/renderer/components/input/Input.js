import React from 'react'

export default class Input<Props, State> extends React.Component<Props, State> {
  onChange() {
    const defaultValue = this.props.defaultValue
    const value = this.state.value
    // defaultValue が変数ならその変数に value を代入する
    if (typeof defaultValue === 'object' && defaultValue.type === 'var') {
      engine.setVar(defaultValue.name, value)
    }

    if (this.props.onChange) {
      execLambda(this.props.onChange, [value])
    }
  }
}
