//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import engine from '../../main/engine'
import generateComponent from '../../util/generateComponent'
import ComponentUtil from '../../util/ComponentUtil'
import LabelContext from '../../contexts/LabelContext'

type RadioSelect = {
  value: string,
  label: Inst,
}

type Props = {
  defaultValue: string | VarInst,
  selectList: (string | RadioSelect)[],
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: string,
}

export default class RadioInput extends Input<Props, State> {
  id: string
  constructor(props: Props) {
    super(props)
    this.id = ComponentUtil.generateId('input-radio')
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []

    let selectList = this.props.selectList.map(select =>
      this._generateSelectComponent(this.id, select, attributes)
    )

    return (
      <div id={this.id} className={`ender-input-radio ${classNames.join(' ')}`}>
        {selectList}
      </div>
    )
  }

  _generateSelectComponent(
    id: string,
    select: string | RadioSelect,
    attributes: Object
  ) {
    let value
    let label
    let inputId
    if (typeof select === 'object') {
      value = engine.eval(select.value).toString()
      inputId = `${id}-${value}`
      label = (
        <LabelContext.Provider value={inputId}>
          {generateComponent(select.label)}
        </LabelContext.Provider>
      )
    } else {
      value = engine.eval(select).toString()
      inputId = `${id}-${value}`
      label = (
        <label htmlFor={inputId}>
          <span>{value}</span>
        </label>
      )
    }

    return (
      <div key={inputId}>
        {label}
        <input
          type="radio"
          {...attributes}
          onChange={this.onChange.bind(this)}
          value={value}
          id={inputId}
          checked={this.state.value === value}
        />
      </div>
    )
  }
}
