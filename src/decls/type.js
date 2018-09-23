import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'

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

declare type AudioEffectState = {
  key: string,
  async: boolean,
  effect: string,
}

declare type AudioBusState = {
  out: string,
  nodeOrder: string[],
  firstNode: string,
  lastNode: string,
  nodes: { [string]: AudioNodeState },
}

declare type AudioState = {
  audioEffects: AudioEffectState[],
  audioBuses: { [string]: AudioBusState },
}

declare interface AudioNodeState {
  type: string;
  src?: string;
}

declare type Selector = {
  type: 'idSelector' | 'classSelector',
  value: string,
}

declare type Config = {
  basePath: ?string,
  auto: ?boolean,
}
