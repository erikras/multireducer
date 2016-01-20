import expect from 'expect';
import multireducerBindActionCreators, {multireducerWrapAction, multireducerWrapActionCreator, multireducerWrapActionCreators} from '../src/multireducerBindActionCreators';
import key from '../src/key';

const testBoundAction = (action, boundAction, multireducerKey) => {
  const result = action();
  const boundResult = boundAction();
  const type = multireducerWrapAction(result, multireducerKey).type;

  expect(boundResult)
    .toBeA('object')
    .toEqual({
      ...result,
      type
    });
};

describe('multireducerBindActionCreators', () => {
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
      }
      multireducerBindActionCreators(multireducerKey, actionCreator, dispatch)();
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
      }
      multireducerBindActionCreators(multireducerKey, actions, dispatch).a();
      return dispatchedAction;
    };

    const getDispatchedActionB = () => {
      let dispatchedAction = null;
      const dispatch = (action) => {
        dispatchedAction = action;
      }
      multireducerBindActionCreators(multireducerKey, actions, dispatch).b();
      return dispatchedAction;
    };

    testBoundAction(actions.a, getDispatchedActionA, multireducerKey);
    testBoundAction(actions.b, getDispatchedActionB, multireducerKey);
  });
});
