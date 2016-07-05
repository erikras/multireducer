import expect from 'expect';
import React, { Children, PropTypes, Component } from 'react';
import { createStore, combineReducers } from 'redux';
import * as reduxImmutable from 'redux-immutable';
import TestUtils from 'react-addons-test-utils';
import immutable from 'immutable';
import multireducer from '../src/multireducer';
import connectMultireducer from '../src/connectMultireducer';
import { multireducerWrapAction } from '../src/multireducerBindActionCreators'
import key from '../src/key';

describe('connectMultireducer', () => {
  const stateSliceKey = 'STATE_SLICE_KEY';
  const actionType = 'MULTIREDUCER_UPDATE';

  class ProviderMock extends Component {
    static childContextTypes = {
      store: PropTypes.object.isRequired
    };

    getChildContext() {
      return { store: this.props.store }
    }

    render() {
      return Children.only(this.props.children)
    }
  }

  describe('(with POJO)', () => {
    const store = createStore(
      combineReducers({
        multireducer: multireducer({
          [stateSliceKey]: (prev = 0, action) => action.type ===  actionType ? action.state : prev
        })
      })
    );

    const WithProps = (props) => (<div {...props} />);

    it('should initialize properly when state is simple type that can be cast to false', () => {

      let compState;

      const ConnectedWithProps = connectMultireducer((key, state) => {
        compState = state.multireducer[key];
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

      const ConnectedWithProps = connectMultireducer((key, state) => {
        compState = state.multireducer[key];
        return {};
      })(WithProps);

      TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <ConnectedWithProps multireducerKey={stateSliceKey}/>
        </ProviderMock>
      );

      store.dispatch(multireducerWrapAction({ type: actionType, state: 123 }, stateSliceKey));
      expect(compState).toEqual(123);

      store.dispatch(multireducerWrapAction({ type: actionType, state: 0 }, stateSliceKey));
      expect(compState).toEqual(0);

      store.dispatch(multireducerWrapAction({ type: actionType, state: false }, stateSliceKey));
      expect(compState).toEqual(false);

      store.dispatch(multireducerWrapAction({ type: actionType, state: Number.NaN }, stateSliceKey));
      expect(isNaN(compState)).toBe(true);

      store.dispatch(multireducerWrapAction({ type: actionType, state: null }, stateSliceKey));
      expect(compState).toEqual(null);

      store.dispatch(multireducerWrapAction({ type: actionType, state: '' }, stateSliceKey));
      expect(compState).toEqual('');

      store.dispatch(multireducerWrapAction({ type: actionType, state: undefined }, stateSliceKey));
      expect(compState).toEqual(undefined);
    });

    it('should add multireducerKey to action type', () => {

      let action = { type: 'FooAction', payload: { a: 1} };

      const reducerKey = 'someReducerKey';
      let wrappedAction = multireducerWrapAction(action, reducerKey);

      expect(wrappedAction).toEqual({
        type: 'FooAction' + key + reducerKey, payload: { a: 1}
      });

      action = { types: ['REQUEST', 'SUCCESS', 'FAILURE'], payload: { b: 1} };
      wrappedAction = multireducerWrapAction(action, reducerKey);

      expect(wrappedAction).toEqual({
        types: [
          'REQUEST' + key + reducerKey,
          'SUCCESS' + key + reducerKey,
          'FAILURE' + key + reducerKey
        ],
        payload: { b: 1}
      });

    });

    it('should accept reducerKey as 1st arg, state as 2nd, ownProps as 3rd argument for mapStateToProps', () => {

      let reducerKey;
      let ownPropsPassedIn;
      let statePassedIn;

      const mapStateToProps = (key, state, ownProps) => {
        reducerKey = key;
        statePassedIn = state.multireducer[key];
        ownPropsPassedIn = ownProps;
        return {};
      };

      const ConnectedWithProps = connectMultireducer(mapStateToProps)(WithProps);

      TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <ConnectedWithProps foo="BAZ" multireducerKey={stateSliceKey}/>
        </ProviderMock>
      );

      expect(reducerKey).toEqual(stateSliceKey);

      store.dispatch(multireducerWrapAction({ type: actionType, state: 777 }, stateSliceKey));
      expect(statePassedIn).toEqual(777);

      expect(ownPropsPassedIn).toEqual({
        foo: 'BAZ',
        multireducerKey: stateSliceKey
      });

    });

    it('should accept reducerKey as 1st arg, dispatch as 2nd, ownProps as 3rd argument for mapDispatchToProps', () => {

      let reducerKey;
      let dispatchPassedIn;
      let ownPropsPassedIn;

      const mapDispatchToProps = (key, dispatch, ownProps) => {
        reducerKey = key;
        dispatchPassedIn = dispatch;
        ownPropsPassedIn = ownProps;
        return { dispatch };
      };

      const ConnectedWithProps = connectMultireducer(null, mapDispatchToProps)(WithProps);

      TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <ConnectedWithProps foo="BAZ" multireducerKey={stateSliceKey}/>
        </ProviderMock>
      );

      expect(reducerKey).toEqual(stateSliceKey);

      expect(typeof dispatchPassedIn === 'function').toEqual(true);

      expect(ownPropsPassedIn).toEqual({
        foo: 'BAZ',
        multireducerKey: stateSliceKey
      });

    });
  });

  describe('(with immutable)', () => {
    const store = createStore(
      reduxImmutable.combineReducers({
        multireducer: multireducer(immutable.fromJS({
          [stateSliceKey]: (prev = 0, action) => {
            return (action.type === actionType) ? action.state : prev;
          }
        }))
      }),
      immutable.Map()
    );
    const WithProps = (props) => (<div {...props} />);

    it('should initialize properly when state is simple type that can be cast to false', () => {
        let compState;

        const ConnectedWithProps = connectMultireducer((key, state) => {
          compState = state.getIn(['multireducer', key]);
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

      const ConnectedWithProps = connectMultireducer((key, state) => {
        compState = state.getIn(['multireducer', key]);
        return {};
      })(WithProps);

      TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <ConnectedWithProps multireducerKey={stateSliceKey}/>
        </ProviderMock>
      );

      store.dispatch(multireducerWrapAction({ type: actionType, state: 123 }, stateSliceKey));
      expect(compState).toEqual(123);

      store.dispatch(multireducerWrapAction({ type: actionType, state: 0 }, stateSliceKey));
      expect(compState).toEqual(0);

      store.dispatch(multireducerWrapAction({ type: actionType, state: false }, stateSliceKey));
      expect(compState).toEqual(false);

      store.dispatch(multireducerWrapAction({ type: actionType, state: Number.NaN }, stateSliceKey));
      expect(isNaN(compState)).toBe(true);

      store.dispatch(multireducerWrapAction({ type: actionType, state: null }, stateSliceKey));
      expect(compState).toEqual(null);

      store.dispatch(multireducerWrapAction({ type: actionType, state: '' }, stateSliceKey));
      expect(compState).toEqual('');

      store.dispatch(multireducerWrapAction({ type: actionType, state: undefined }, stateSliceKey));
      expect(compState).toEqual(undefined);
    });

    it('should add multireducerKey to action type', () => {

      let action = { type: 'FooAction', payload: { a: 1} };

      const reducerKey = 'someReducerKey';
      let wrappedAction = multireducerWrapAction(action, reducerKey);

      expect(wrappedAction).toEqual({
        type: 'FooAction' + key + reducerKey, payload: { a: 1}
      });

      action = { types: ['REQUEST', 'SUCCESS', 'FAILURE'], payload: { b: 1} };
      wrappedAction = multireducerWrapAction(action, reducerKey);

      expect(wrappedAction).toEqual({
        types: [
          'REQUEST' + key + reducerKey,
          'SUCCESS' + key + reducerKey,
          'FAILURE' + key + reducerKey
        ],
        payload: { b: 1}
      });
    });

    it('should accept reducerKey as 1st arg, state as 2nd, ownProps as 3rd argument for mapStateToProps', () => {

      let reducerKey;
      let ownPropsPassedIn;
      let statePassedIn;

      const mapStateToProps = (key, state, ownProps) => {
        reducerKey = key;
        statePassedIn = state.getIn(['multireducer', key]);
        ownPropsPassedIn = ownProps;
        return {};
      };

      const ConnectedWithProps = connectMultireducer(mapStateToProps)(WithProps);

      TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <ConnectedWithProps foo="BAZ" multireducerKey={stateSliceKey}/>
        </ProviderMock>
      );

      expect(reducerKey).toEqual(stateSliceKey);

      store.dispatch(multireducerWrapAction({ type: actionType, state: 777 }, stateSliceKey));
      expect(statePassedIn).toEqual(777);

      expect(ownPropsPassedIn).toEqual({
        foo: 'BAZ',
        multireducerKey: stateSliceKey
      });
    });

    it('should accept reducerKey as 1st arg, dispatch as 2nd, ownProps as 3rd argument for mapDispatchToProps', () => {

      let reducerKey;
      let dispatchPassedIn;
      let ownPropsPassedIn;

      const mapDispatchToProps = (key, dispatch, ownProps) => {
        reducerKey = key;
        dispatchPassedIn = dispatch;
        ownPropsPassedIn = ownProps;
        return { dispatch };
      };

      const ConnectedWithProps = connectMultireducer(null, mapDispatchToProps)(WithProps);

      TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <ConnectedWithProps foo="BAZ" multireducerKey={stateSliceKey}/>
        </ProviderMock>
      );

      expect(reducerKey).toEqual(stateSliceKey);

      expect(typeof dispatchPassedIn === 'function').toEqual(true);

      expect(ownPropsPassedIn).toEqual({
        foo: 'BAZ',
        multireducerKey: stateSliceKey
      });
    });
  });
});
