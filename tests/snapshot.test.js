// @flow
import { ipcRenderer } from 'electron'
import React from 'react'
import { Provider } from 'react-redux'

import Game from '../src/js/renderer/components/Game'
import engine from '../src/js/renderer/main/engine'
import { toAbsolutePath } from '../src/js/renderer/util/util'
import store from '../src/js/renderer/main/store'
import { generateConfig } from '../src/js/renderer/main/config'
import { resetState } from '../src/js/renderer/actions/actions'

import fs from 'fs'
import path from 'path'

import renderer from 'react-test-renderer'

const testDirnames = fs.readdirSync(__dirname)
testDirnames.forEach(testName => {
  if (testName.startsWith('__')) {
    return
  }
  if (!fs.statSync(path.join(__dirname, testName)).isDirectory()) {
    return
  }
  describe('components test', () => {
    beforeAll(() => {
      // ruby で width を求めるあたりで使っているものの mock
      const createElement = document.createElement.bind(document)
      document.createElement = tagName => {
        if (tagName === 'canvas') {
          return {
            getContext: () => ({
              measureText: () => ({}),
            }),
          }
        }
        return createElement(tagName)
      }
    })
    it(`${testName}`, () => {
      let configPath = path.join(__dirname, testName, 'config.json')
      const config = generateConfig(configPath)
      store.dispatch(resetState())
      engine.init(config)

      const tree = renderer.create(
        <Provider store={store}>
          <Game />
        </Provider>,
        document.getElementById('contents')
      )
      while (!engine.isFinished) {
        debugger
        const inst = engine.lookahead()
        if (engine._yieldValue === 'snapshot') {
          debugger
          expect(tree.toJSON()).toMatchSnapshot()
        }
        engine.exec()
      }
    })
  })
})
