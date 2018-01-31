import React from 'react'
import { connect } from 'react-redux'
import generateComponent from '../util/generateComponent'

const Game = ({ components = {} }) => {
  let childComponents = []
  for (const key in components) {
    const children = components[key]
    if (children) {
      childComponents.push(
        generateComponent({
          type: 'func',
          name: 'Box',
          props: {
            children,
          },
          key,
        })
      )
    }
  }
  return (
    <div id="inner" className="inner-view" key="inner-view">
      {childComponents}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    components: state.components,
  }
}

export default connect(mapStateToProps)(Game)
