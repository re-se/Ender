import React from 'react'
import { connect } from 'react-redux'

const History = ({ history, classNames }) => {
  return (
    <pre className={`ender-history ${classNames.join(' ')}`}>{history}</pre>
  )
}

const mapStateToProps = state => {
  return {
    history: state.MessageBox.history,
  }
}

export default connect(mapStateToProps)(History)
