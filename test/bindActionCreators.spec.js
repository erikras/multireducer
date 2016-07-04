import expect from 'expect';
import bindActionCreators from '../src/bindActionCreators';
import wrapAction from '../src/wrapAction';

const testBoundAction = (action, boundAction, multireducerKey) => {
  const result = action();
  const boundResult = boundAction();
  const type = wrapAction(result, multireducerKey).type;

  expect(boundResult)
    .toBeA('object')
    .toEqual({
      ...result,
      type,
    });
};

describe('bindActionCreators', () => {
  it('should wrap a single action function', () => {
    const multireducerKey = 'foo';
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
      bindActionCreators(actionCreator, dispatch, multireducerKey)();
      return dispatchedAction;
    };

    testBoundAction(actionCreator, getDispatchedAction, multireducerKey);
  });

  it('should bind an object of action functions', () => {
    const multireducerKey = 'bar';
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
      bindActionCreators(actions, dispatch, multireducerKey).a();
      return dispatchedAction;
    };

    const getDispatchedActionB = () => {
      let dispatchedAction = null;
      const dispatch = (action) => {
        dispatchedAction = action;
      };
      bindActionCreators(actions, dispatch, multireducerKey).b();
      return dispatchedAction;
    };

    testBoundAction(actions.a, getDispatchedActionA, multireducerKey);
    testBoundAction(actions.b, getDispatchedActionB, multireducerKey);
  });
});
