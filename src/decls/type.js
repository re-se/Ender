import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'

declare type Image = {
  src: string,
  className: string,
  callback: Function
}

declare type ReduxInitAction = { type: '@@INIT' };

declare type Action = ReduxInitAction;

declare type Store = ReduxStore<State, Action>;

declare type Dispatch = ReduxDispatch<Action>;

declare module './ender.js' {
  declare module.exports: any;
}
