import React from 'react'
import { connect } from 'react-redux'
import generateComponent from '../util/generateComponent'
import AudioEngine from '../containers/AudioEngine'

const Game = ({ components = {}, audio = {} }) => {
  return (
    <div id="inner" className="inner-view" key="inner-view">
      {generateChildComponents(components)}
      <AudioEngine />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    components: state.components,
    audio: state.audio,
  }
}

export default connect(mapStateToProps)(Game)

/**
 * Enderコンポーネントの配列からReactコンポーネントの配列を作成
 * @params components
 * @retrun React.Component[]
 */
const generateChildComponents = components => {
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
  return childComponents
}
