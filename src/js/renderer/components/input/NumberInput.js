//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'

type Props = {
  defaultValue: number | VarInst,
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: number,
}

export default class NumberInput extends Input<Props, State> {
  getInitialState() {
    return {
      value:
        typeof this.props.defaultValue === 'number'
          ? this.props.defaultValue
          : 0,
    }
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []

    return (
      <input
        type="number"
        {...attributes}
        className={`ender-input-number ${classNames.join(' ')}`}
        onChange={this.onChange.bind(this)}
        value={this.state.value}
      />
    )
  }
}
