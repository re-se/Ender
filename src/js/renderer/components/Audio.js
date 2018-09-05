import React from 'react'
import store from '../main/store'
import { startAnimation } from '../actions/actions'
import audioEffectList from '../config/audioEffectList'

export default class Audio extends React.Component {
  audio: Audio
  audioNodes: AudioNode[]

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.audio = this.props.audio
  }

  componentWillUpdate() {
    if(this._hasEvent()) {
      this._processAllEvents()
    }
  }

  render() {
    return null
  }

  _processAllEvents() {
    this.props.events.forEach(this._processEvent.bind(this))
    store.dispatch()
  }

  /**
   * オーディオイベントタイプに応じた処理にディスパッチする
   * @param event
   */
  _processEvent(event) {
    switch(event.type) {
      case 'PLAY':
        this.audio.play()
        break;
      case 'STOP':
        this.audio.pause()
        this.audio.currentTime = 0
        break;
      case 'PAUSE':
        this.audio.pause()
        break;
      case 'EFFECT':
        audioEffectList[event](this.audio)
        break;
      default :
        console.warn('undefined audio event type!! audioEventType: ' + event.type)
        break;
    }
  }

  /**
   * @return bool
   */
  _hasEvent() {
    return this.props.events.length > 0
  }

  _updateAudioNodes() {
    
  }
}
