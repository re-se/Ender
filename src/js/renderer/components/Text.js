import React from 'react'

const Text = ({ text, classNames }) => {
  return <span className={`ender-text ${classNames.join(' ')}`}>{text}</span>
}

export default Text
