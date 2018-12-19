//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import LabelContext from '../../contexts/LabelContext'
import ComponentUtil from '../../util/ComponentUtil'

type Props = {
  defaultValue: boolean | VarInst,
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: boolean,
}

export default class StyledCheckboxInput extends Input<Props, State> {
  id: string
  constructor(props: Props) {
    super(props)
    this.id = ComponentUtil.generateId('input-checkbox')
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []

    return (
      <LabelContext.Consumer>
        {id => {
          this.id = id || this.id
          return (
            <label className="ender-input-switch">
              <input
                type="checkbox"
                {...attributes}
                className={`ender-input-checkbox ${classNames.join(' ')}`}
                onChange={this.onChange.bind(this)}
                checked={this.state.value}
                id={this.id}
              />
              <span />
            </label>
          )
        }}
      </LabelContext.Consumer>
    )
  }
}
