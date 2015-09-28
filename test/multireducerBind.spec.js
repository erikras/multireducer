import expect from 'expect';
import multireducerBind from '../src/multireducerBind';
import key from '../src/key';

const testBoundAction = (action, boundAction, multireducerKey) => {
  const result = action();
  const boundResult = boundAction();
  expect(boundResult)
    .toBeA('object')
    .toEqual({
      ...result,
      [key]: multireducerKey
    });
};

describe('multireducerBind', () => {
  it('should bind a single action function', () => {
    const multireducerKey = 'foo';
    const action = () => ({
      dog: 7,
      cat: 'Felix'
    });
    testBoundAction(action, multireducerBind(action, multireducerKey), multireducerKey);
  });

  it('should bind an object of action functions', () => {
    const multireducerKey = 'bar';
    const actions = {
      a: () => ({
        dog: 7,
        cat: 'Felix'
      }),
      b: () => ({
        age: 69,
        name: 'Bobby Tables'
      })
    };
    const result = multireducerBind(actions, multireducerKey);
    testBoundAction(actions.a, result.a, multireducerKey);
    testBoundAction(actions.b, result.b, multireducerKey);
  });
});
