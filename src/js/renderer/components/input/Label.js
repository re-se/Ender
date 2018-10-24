//@flow
import React from 'react'
import type { FuncInst } from '../../main/instMap'
import ComponentUtil from '../../util/ComponentUtil'
import generateComponent from '../../util/generateComponent'

const LabelContext = React.createContext('')

type Props = {
  children: Object[],
  classNames: string[],
}

type State = {}

export default class Label extends React.Component<Props, State> {
  render() {
    const childComponents = this.props.children.map(child =>
      generateComponent(child)
    )
    const id = ComponentUtil.generateId('input')
    return (
      <LabelContext.Provider value={id}>
        <label classNames={this.props.classNames.join(' ')} for={id}>
          {childComponents}
        </label>
      </LabelContext.Provider>
    )
  }
}
