import React from 'react'
import engine from '../../main/engine'

class Button extends React.Component {
  onClick: () => void
  render() {
    let classNames = []
    classNames = classNames.concat(this.props.classNames)
    return <div onClick={this.onClick} className={`${classNames.join(' ')}`} />
  }
}

export class ExecButton extends Button {
  constructor(props) {
    super(props)
    this.onClick = () => {
      engine.setVar('config.auto', false)
      engine.exec()
    }
  }
}

export class StopAutoButton extends Button {
  constructor(props) {
    super(props)
    this.onClick = () => {
      engine.setVar('config.auto', false)
    }
  }
}
