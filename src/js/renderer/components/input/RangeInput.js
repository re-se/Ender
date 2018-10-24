//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'

type Props = {
  defaultValue: number | VarInst,
  min: number,
  max: number,
  step: number,
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: number,
}

export default class RangeInput extends Input<Props, State> {
  getInitialState() {
    return {
      value:
        typeof this.props.defaultValue === 'number'
          ? this.props.defaultValue
          : false,
    }
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []
    const min = this.props.min || attributes.min || 0.0
    const max = this.props.max || attributes.max || 1.0
    const step = this.props.step || attributes.step || 0.1

    return (
      <input
        type="range"
        {...attributes}
        className={`ender-input-range ${classNames.join(' ')}`}
        onChange={this.onChange.bind(this)}
        value={this.state.value}
        min={min}
        max={max}
        step={step}
        id={this.context}
      />
    )
  }
}
