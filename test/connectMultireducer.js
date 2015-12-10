import expect from 'expect';
import React, { Children, PropTypes, Component } from 'react';
import { createStore, combineReducers } from 'redux';
import TestUtils from 'react-addons-test-utils';
import multireducer from '../src/multireducer';
import connectMultireducer from '../src/connectMultireducer';
import key from '../src/key';

describe('connectMultireducer', () => {

  const stateSliceKey = 'STATE_SLICE_KEY';
  const actionType = 'MULTIREDUCER_UPDATE';

  class ProviderMock extends Component {
    static childContextTypes = {
      store: PropTypes.object.isRequired
    }

    getChildContext() {
      return { store: this.props.store }
    }

    render() {
      return Children.only(this.props.children)
    }
  }

  const store = createStore(combineReducers({
    multireducer: multireducer({
      [stateSliceKey]: (prev = 0, action = {}) => {
        return action.type ===  actionType ? action.state : prev;
      }
    })
  }));

  const WithProps = (props) => (<div {...props} />);

  it('should initialize properly when state is simple type that can be cast to false', () => {

    let compState;

    const ConnectedWithProps = connectMultireducer((state) => {
      compState = state;
      return {};
    })(WithProps);

    TestUtils.renderIntoDocument(
      <ProviderMock store={store}>
        <ConnectedWithProps multireducerKey={stateSliceKey}/>
      </ProviderMock>
    );

    expect(compState).toEqual(0);
  });

  it('should work properly when state slice is set to 0, false, NaN, null, or empty string', () => {
    let compState;

    const ConnectedWithProps = connectMultireducer((state) => {
      compState = state;
      return {};
    })(WithProps);

    TestUtils.renderIntoDocument(
      <ProviderMock store={store}>
        <ConnectedWithProps multireducerKey={stateSliceKey}/>
      </ProviderMock>
    );

    store.dispatch({ type: actionType, state: 123, [key]: stateSliceKey });
    expect(compState).toEqual(123);

    store.dispatch({ type: actionType, state: 0, [key]: stateSliceKey });
    expect(compState).toEqual(0);

    store.dispatch({ type: actionType, state: false, [key]: stateSliceKey });
    expect(compState).toEqual(false);

    // store.dispatch({ type: actionType, state: Number.NaN, [key]: stateSliceKey });
    // expect(isNaN(compState)).toBe(true);

    store.dispatch({ type: actionType, state: null, [key]: stateSliceKey });
    expect(compState).toEqual(null);

    store.dispatch({ type: actionType, state: '', [key]: stateSliceKey });
    expect(compState).toEqual('');

    store.dispatch({ type: actionType, state: undefined, [key]: stateSliceKey });
    expect(compState).toEqual(undefined);
  });

  it('should throw error when there is no state slice for given multireducerKey', () => {
    let compState;

    const ConnectedWithProps = connectMultireducer((state) => {
      compState = state;
      return {};
    })(WithProps);

    try {
      TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <ConnectedWithProps />
        </ProviderMock>
      );
    }
    catch(e) {
      const errorMessage = `No state for multireducer key "undefined". You initialized multireducer with "${stateSliceKey}".`
      expect(e.message).toEqual(errorMessage);
    }
  });

  it('should accept props as a second argument', () => {

    let propsPassedIn;

    const ConnectedWithProps = connectMultireducer((state, props) => {
      propsPassedIn = props
      return {}
    })(WithProps);


    TestUtils.renderIntoDocument(
      <ProviderMock store={store}>
        <ConnectedWithProps foo="BAZ" multireducerKey={stateSliceKey}/>
      </ProviderMock>
    );

    expect(propsPassedIn).toEqual({
      foo: 'BAZ'
    });
  });

});