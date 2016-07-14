import expect from 'expect';
import bindActionCreators from '../src/bindActionCreators';
import key from '../src/key';

const testBoundAction = (action, boundAction, reducerKey) => {
  const result = action();
  const boundResult = boundAction();
  result.meta = {
    ...result.meta,
    [key]: reducerKey,
  };

  expect(boundResult)
    .toBeA('object')
    .toEqual(result);
};

describe('bindActionCreators', () => {
  it('should wrap a single action function', () => {
    const reducerKey = 'foo';
    const actionCreator = () => ({
      type: 'testaction',
      dog: 7,
      cat: 'Felix'
    });

    const getDispatchedAction = () => {
      let dispatchedAction = null;
      const dispatch = (action) => {
        dispatchedAction = action;
      };
      bindActionCreators(actionCreator, dispatch, reducerKey)();
      return dispatchedAction;
    };

    testBoundAction(actionCreator, getDispatchedAction, reducerKey);
  });

  it('should bind an object of action functions', () => {
    const reducerKey = 'bar';
    const actions = {
      a: () => ({
        type: 'testaction',
        dog: 7,
        cat: 'Felix'
      }),
      b: () => ({
        type: 'testaction',
        age: 69,
        name: 'Bobby Tables'
      })
    };
    const getDispatchedActionA = () => {
      let dispatchedAction = null;
      const dispatch = (action) => {
        dispatchedAction = action;
      };
      bindActionCreators(actions, dispatch, reducerKey).a();
      return dispatchedAction;
    };

    const getDispatchedActionB = () => {
      let dispatchedAction = null;
      const dispatch = (action) => {
        dispatchedAction = action;
      };
      bindActionCreators(actions, dispatch, reducerKey).b();
      return dispatchedAction;
    };

    testBoundAction(actions.a, getDispatchedActionA, reducerKey);
    testBoundAction(actions.b, getDispatchedActionB, reducerKey);
  });
});
