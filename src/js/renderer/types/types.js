// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'

export type ReduxInitAction = { type: '@@INIT' }

export type Action = ReduxInitAction

export type Store = ReduxStore<any, Action>

export type Dispatch = ReduxDispatch<Action>
