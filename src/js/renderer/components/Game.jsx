import React from 'react'
import { connect } from 'react-redux'
import generateComponent from '../util/generateComponent'

const Game = ({ components = {} }) => {
  let childComponents = []
  for (const key in components) {
    const children = components[key]
    childComponents.push(
      generateComponent("Box", children, key)
    )
  }
  return (
    <div id="inner" className="inner-view" key="inner-view">
      {childComponents}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    components : state.components
  }
}

export default connect(mapStateToProps)(Game)
