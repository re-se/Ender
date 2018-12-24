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

export function generateAudioNodeState(type, params) {
  switch (type) {
    case 'source':
      return {
        type,
        src: undefined,
        currentTime: 0,
        isPlay: false,
        isLoop: false,
        loopOffsetTime: 0,
        ...params,
      }
    case 'gain':
      return {
        type,
        gain: 1.0,
        ...params,
      }
    default:
      console.warn('undefined audio node type!!', audioNodeState)
      return null
  }
}
