import React from 'react'
import generateComponent from '../util/generateComponent'
import store from '../main/store'
import { addComponents, deleteStyle } from '../actions/actions'
import ComponentUtil from '../util/ComponentUtil'
import { snapshot } from '../util/save'

type Props = {
  children: ComponentMaterial,
  classNames: string[],
  blurSelector: string,
}

type State = {}

class BlurBox extends React.Component<Props, State> {
  key: string
  constructor(props) {
    super(props)
    this.key = ComponentUtil.generateId('blur-box')
  }

  render() {
    const classNames = this.props.classNames || []
    const children = this.props.children || []

    let childComponents = []
    for (const key in children) {
      const child = children[key]
      if (child) {
        childComponents.push(generateComponent(child))
      }
    }

    return (
      <div
        className={`ender-box ${classNames.join(' ')}`}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {childComponents}
      </div>
    )
  }

  onMouseEnter(event) {
    snapshot(false)
    const css = `${this.props.blurSelector} {
      filter: blur(0.15em);
      transition: filter 125ms ease-out;
    }`
    store.dispatch(
      addComponents(
        [
          {
            type: 'func',
            name: 'Style',
            args: [css, this.key],
          },
        ],
        'style'
      )
    )
  }

  onMouseLeave(event) {
    store.dispatch(deleteStyle(this.key))
  }
}

export default BlurBox
