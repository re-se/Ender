//@flow
import React from 'react'
import store from '../main/store'
import audioEffectList from '../config/audioEffectList'

export default class AudioEngine extends React.Component {
  audioNodes: AudioNode[]

  constructor(props) {
    super(props)
  }

  componentWillUpdate() {
    if(this._hasEvent()) {
      this._processAllEvents()
    }
  }

  render() {
    return null
  }

  _generateAudioNode(audioNodeState: AudioNodeState): {
      
  }

  _updateAudioNodes() {
    
  }
}

/** memo
declare interface AudioNodeState {
  type: string,
}

declare type AudioElementNodeState implements AudioNode = {
  src: string,
}

declare type GainNodeState implements AudioNode = {
  type: string,
  gain: number,
}

declare type BiquidFilterNodeState implements AudioNode = {
  type: string,
  frequency: number,
  detune: number,
  q: number,
  gain: number,
  filterType: string,
}
 */

const mapStateToProps = state => {
  return {
    audioNodes: state.audios,
  }
}

export default connect(mapStateToProps)(MessageBox)