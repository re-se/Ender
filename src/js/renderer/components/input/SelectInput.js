//@flow
import React from 'react'

import Input from './Input'
import type { LambdaInst, VarInst } from '../../main/instMap'
import engine from '../../main/engine'
import generateComponent from '../../util/generateComponent'
import ComponentUtil from '../../util/ComponentUtil'
import LabelContext from '../../contexts/LabelContext'

type Option = {
  value: string,
  label: Inst,
}

type Props = {
  defaultValue: string | VarInst,
  selectList: string[],
  onChange: ?LambdaInst,
  attributes: ?Object,
  classNames: ?(string[]),
}

type State = {
  value: string,
}

export default class SelectInput extends Input<Props, State> {
  id: string
  constructor(props: Props) {
    super(props)
    this.id = ComponentUtil.generateId('select')
  }

  render() {
    const attributes = this.props.attributes || {}
    const classNames = this.props.classNames || []

    let selectList = this.props.selectList.map(select =>
      this._generateOptionComponent(select)
    )

    return (
      <select
        id={this.id}
        className={`ender-select ${classNames.join(' ')}`}
        {...attributes}
        value={this.state.value}
        onChange={this.onChange.bind(this)}
      >
        {selectList}
      </select>
    )
  }

  _generateOptionComponent(select: string) {
    let value = engine.eval(select).toString()
    return (
      <option value={value} key={`${this.id}-${value}`}>
        {value}
      </option>
    )
  }
}
