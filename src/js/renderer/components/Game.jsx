import React from 'react'
import { connect } from 'react-redux'
import generateComponent from '../util/generateComponent'
import Audio from '../components/Audio'

const Game = ({ components = {}, audios = {} }) => {
  return (
    <div id="inner" className="inner-view" key="inner-view">
      {generateChildComponents(components)}
      {generateAudioComponents(audios)}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    components: state.components,
    audios: state.audios,
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

/**
 * Enderオーディオオブジェクトの配列からReactコンポーネントの配列を作成
 * @params audios
 * @retrun React.Component[]
 */
const generateAudioComponents = audios => {
  let audioComponents = []
  for (const key in audios) {
    const audio = audios[key]
    audioComponents.push(
      <Audio src={audio.src} type={audio.type} events={audio.events}/>
    )
  }
  return audioComponents;
}