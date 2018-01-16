import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'

declare type ReduxInitAction = { type: '@@INIT' };

declare type Action = ReduxInitAction;

declare type Store = ReduxStore<State, Action>;

declare type Dispatch = ReduxDispatch<Action>;

declare type ImageState = {
  key: 'image',
  src: string,
  classList: string[],
  effect: string
}

declare module './ender.js' {
  declare module.exports: any;
}
