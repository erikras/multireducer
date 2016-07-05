import expect from 'expect';
import wrapAction from '../src/wrapAction';
import key from '../src/key';

describe('wrapAction', () => {
  it('wrap action', () => {
    const action = { type: 'INCREMENT' };
    const wrappedAction = wrapAction(action, 'additional');
    expect(wrappedAction).toEqual({
      type: 'INCREMENT',
      meta: {
        [key]: 'additional',
      },
    });
  });
});
