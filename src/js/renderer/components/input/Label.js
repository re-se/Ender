//@flow
import React from 'react'
import type { FuncInst } from '../../main/instMap'
import ComponentUtil from '../../util/ComponentUtil'
import generateComponent from '../../util/generateComponent'
import LabelContext, { EMPTY_LABEL_CONTEXT } from '../../contexts/LabelContext'
import engine from '../../main/engine'

type Props = {
  text: string,
  children: ComponentState[],
  classNames: string[],
}

type State = {}

export default class Label extends React.Component<Props, State> {
  render() {
    const childComponents = this.props.children.map(child => {
      return generateComponent(child)
    })
    return (
      <LabelContext.Consumer>
        {contextId => {
          const id =
            contextId !== EMPTY_LABEL_CONTEXT
              ? contextId
              : ComponentUtil.generateId('input')
          return (
            <LabelContext.Provider value={id}>
              <label className={this.props.classNames.join(' ')} htmlFor={id}>
                {this.props.text}
                {childComponents}
              </label>
            </LabelContext.Provider>
          )
        }}
      </LabelContext.Consumer>
    )
  }
}
