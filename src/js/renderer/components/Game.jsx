import React from 'react'
import { connect } from 'react-redux'

const Game = ({ children }) => {
  if(children == null) {
    children = []
  }
  return (
    <div id="inner" className="inner-view" key="inner-view">
      {children}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    children : state.components
  }
}

export default connect(mapStateToProps)(Game)
