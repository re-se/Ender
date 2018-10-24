//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'

type Props = {
  defaultValue: boolean | VarInst,
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: boolean,
}

export default class CheckboxInput extends Input<Props, State> {
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
}
