import 'react-native'
import React from 'react'
import App from '../App'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<App/>)
  expect(tree.toJSON()).toMatchSnapshot()
})

global.fetch = () => ({
  then: () => {}
})

jest.mock('react-native-svg', () => ({
}));
jest.mock('NativeModules', () => {
  return {
    UIManager: {
      RCTView: {}
    },
    RNGestureHandlerModule: {
      State: {},
      attachGestureHandler: jest.fn(),
      createGestureHandler: jest.fn()
    },
    KeyboardObserver: {}
  } 
})