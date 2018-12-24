import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'
import type { AudioEffect } from '../js/renderer/util/audio/AudioEffect'

declare type ReduxInitAction = { type: '@@INIT' }

declare type Action = ReduxInitAction

declare type Dispatch = ReduxDispatch<Action>

declare type ImageState = {
  key: 'image',
  src: string,
  classList: string[],
  effect: string,
}

declare type Message = {
  type: string,
  body: ?string,
}

declare module './ender.js' {
  declare module.exports: any
}

declare type ComponentState = {
  type: 'func',
  name: string,
  key: string,
  props: ComponentProps,
}

declare type ComponentProps = {
  classNames: ?(string[]),
  children: ?(ComponentState[]),
  style: ?any,
  //and more...
}

declare type AudioBusState = {
  out: string,
  nodeOrder: string[],
  firstNode: string,
  lastNode: string,
  nodes: { [string]: AudioNodeState },
}

declare type AudioState = {
  audioEffects: AudioEffect[],
  audioBuses: { [string]: AudioBusState },
}

declare interface AudioNodeState {
  type: string;
  audioEffectKey?: string;
  name?: string;
}

declare type Selector = {
  type: 'idSelector' | 'classSelector',
  value: string,
}

declare type Config = {
  basePath: ?string,
  auto: ?boolean,
}

declare type SaveData = {
  name: string,
  date: Date,
  state: Object,
  engine: EngineContext,
  thumbnail: any,
}

declare type EngineContext = {
  scriptPath: string,
  pcStack: number[],
  instsStack: Inst[][],
  nameMapStack: { [string]: any }[],
}
