import React from 'react'
import engine from '../../main/engine'
import { execLambda } from '../../util/lambda'

class BaseButton extends React.Component {
  onClick: () => void
  render() {
    let classNames = []
    classNames = classNames.concat(this.props.classNames)
    return (
      <div
        onClick={this.onClick.bind(this)}
        className={`${classNames.join(' ')}`}
      >
        {this.props.content}
      </div>
    )
  }
}

export class Button extends BaseButton {
  constructor(props) {
    super(props)
    this.onClick = (event: Event) => {
      event.stopPropagation()
      if (props.onClick) {
        execLambda(props.onClick)
        engine.exec()
      }
    }
  }
}

import store from '../../main/store'
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
    this.onClick = () => {
      engine.setVar('config.auto', false)
    }
  }
}
