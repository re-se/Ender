//@flow
import React from 'react'

import type { LambdaInst, VarInst } from '../../main/instMap'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'
import { isVarInst } from '../../util/inst'

type Props = {
  defaultValue: string | VarInst,
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: string,
}

export default class TextInput extends React.Component<Props, State> {
  getInitialState() {
    return {
      value:
        typeof this.props.defaultValue === 'string'
          ? this.props.defaultValue
          : '',
    }
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []

    return (
      <input
        type="text"
        {...attributes}
        className={`ender-input-text ${classNames.join(' ')}`}
        onChange={this.onChange.bind(this)}
        value={this.state.value}
      />
    )
  }

  onChange() {
    const defaultValue = this.props.defaultValue
    const value = this.state.value
    // defaultValue が変数ならその変数に value を代入する
    if (isVarInst(defaultValue)) {
      engine.setVar(defaultValue.name, value)
    }

    if (this.props.onChange) {
      execLambda(this.props.onChange, [value])
    }
  }
}
