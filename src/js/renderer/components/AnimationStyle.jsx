import React from 'react'
import { connect } from 'react-redux'
import generateComponent from '../util/generateComponent'
import { toCss } from '../util/util'

const AnimationStyle = ({ animationStyle = {} }) => {
  return (
    <style id='animation-style'>
      {toCss(animationStyle)}
    </style>
  )
}

const mapStateToProps = (state) => {
  return {
    animationStyle : state.animationStyle
  }
}

export default connect(mapStateToProps)(AnimationStyle)
