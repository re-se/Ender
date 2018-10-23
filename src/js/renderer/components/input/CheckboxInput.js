//@flow
import React from 'react'

import type { LambdaInst, VarInst } from '../../main/instMap'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'
import { isVarInst } from '../../util/inst'

type Props = {
  defaultValue: boolean | VarInst,
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: boolean,
}

export default class CheckboxInput extends React.Component<Props, State> {
  getInitialState() {
    return {
      value:
        typeof this.props.defaultValue === 'boolean'
          ? this.props.defaultValue
          : false,
    }
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []

    return (
      <input
        type="checkbox"
        {...attributes}
        className={`ender-input-checkbox ${classNames.join(' ')}`}
        onChange={this.onChange.bind(this)}
        checked={this.state.value}
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
