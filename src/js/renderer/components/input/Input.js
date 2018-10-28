//@flow
import React from 'react'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'

export default class Input<Props, State> extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: engine.eval(this.props.defaultValue),
    }
  }

  onChange(event: Event) {
    const target = event.target
    const defaultValue = this.props.defaultValue
    const value = target.type === 'checkbox' ? target.checked : target.value
    console.log(value)
    // defaultValue が変数ならその変数に value を代入する
    if (typeof defaultValue === 'object' && defaultValue.type === 'var') {
      engine.setVar(defaultValue.name, value)
    }

    this.setState({
      ...this.state,
      value,
    })

    if (this.props.onChange) {
      execLambda(this.props.onChange, [value])
    }
  }
}
