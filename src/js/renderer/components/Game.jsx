import React from 'react'
import { connect } from 'react-redux'
import generateComponent from '../util/generateComponent'

const Game = ({ children = [] }) => {
  let childComponents = []
  for (const key in children) {
    const child = children[key]
    childComponents.push(generateComponent(child.name, child.args, key))
  }
  return (
    <div id="inner" className="inner-view" key="inner-view">
      {childComponents}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    children : state.components
  }
}

export default connect(mapStateToProps)(Game)
