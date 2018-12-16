//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import LabelContext from '../../contexts/LabelContext'
import ComponentUtil from '../../util/ComponentUtil'

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
  id: string
  constructor(props: Props) {
    super(props)
    this.id = ComponentUtil.generateId('input-range')
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []
    const min = this.props.min || attributes.min || 0.0
    const max = this.props.max || attributes.max || 1.0
    const step = this.props.step || attributes.step || 0.1

    return (
      <LabelContext.Consumer>
        {id => {
          this.id = id || this.id
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
              id={this.id}
            />
          )
        }}
      </LabelContext.Consumer>
    )
  }
}
