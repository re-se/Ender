//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import LabelContext from '../../contexts/LabelContext'
import ComponentUtil from '../../util/ComponentUtil'

type Props = {
  defaultValue: string | VarInst,
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: string,
}

export default class TextInput extends Input<Props, State> {
  id: string
  constructor(props: Props) {
    super(props)
    this.id = ComponentUtil.generateId('input-text')
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
              type="text"
              {...attributes}
              className={`ender-input-text ${classNames.join(' ')}`}
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
