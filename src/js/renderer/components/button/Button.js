import React from 'react'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'
import store from '../../main/store'
import { addComponents, deleteStyle } from '../../actions/actions'
import generateComponent from '../../util/generateComponent'

class BaseButton extends React.Component {
  onClick: () => void
  render() {
    let classNames = [].concat(this.props.classNames)
    let childComponents = []
    for (const key in this.props.children) {
      const child = this.props.children[key]
      if (child) {
        childComponents.push(generateComponent(child))
      }
    }

    return (
      <div
        onClick={this.onClick.bind(this)}
        className={`${classNames.join(' ')}`}
      >
        {childComponents}
      </div>
    )
  }
}

export class Button extends BaseButton {
  constructor(props) {
    super(props)
    this.onClick = (event: Event) => {
      event.stopPropagation()
      execOnClick(props.onClick)
    }
  }
}

export class ExecButton extends BaseButton {
  constructor(props) {
    super(props)
    this.onClick = (event: Event) => {
      event.stopPropagation()
      engine.exec()
    }
  }
}

export class StopAutoButton extends BaseButton {
  constructor(props) {
    super(props)
    this.onClick = (event: Event) => {
      event.stopPropagation()
      engine.setVar('config.auto', false)
    }
  }
}

export class HideButton extends BaseButton {
  constructor(props) {
    super(props)
    this.onClick = (event: Event) => {
      event.stopPropagation()
      const css = `${props.selector} {display: none;}`
      store.dispatch(
        addComponents(
          [
            {
              type: 'func',
              name: 'Style',
              args: [css, 'hide'],
            },
          ],
          'style'
        )
      )
      execOnClick(props.onClick)
    }
  }
}

export class ShowButton extends BaseButton {
  constructor(props) {
    super(props)
    this.onClick = (event: Event) => {
      event.stopPropagation()
      store.dispatch(deleteStyle('hide'))

      execOnClick(props.onClick)
    }
  }
}

function execOnClick(lambda) {
  if (!lambda) {
    return
  }

  //engine.pc--
  execLambda(lambda)

  if (isDuringAnimation()) {
    engine.exec()
  }
  engine.exec()
}

function isDuringAnimation() {
  const animation = store.getState().animation
  for (const key in animation) {
    if (animation[key].isStarted && !animation[key].isFinished) {
      return true
    }
  }
  return false
}
