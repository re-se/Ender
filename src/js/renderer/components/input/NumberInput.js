//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import LabelContext from '../../contexts/LabelContext'
import ComponentUtil from '../../util/ComponentUtil'

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
  id: string
  constructor(props: Props) {
    super(props)
    this.id = ComponentUtil.generateId('input-number')
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []

    return (
      <LabelContext.Consumer>
        {id => {
          this.id = id || this.id
          return (
            <input
              type="number"
              {...attributes}
              className={`ender-input-number ${classNames.join(' ')}`}
              onChange={this.onChange.bind(this)}
              value={this.state.value}
              id={this.id}
            />
          )
        }}
      </LabelContext.Consumer>
    )
  }
}
