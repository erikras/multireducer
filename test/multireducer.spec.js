import expect from 'expect';
import multireducer from '../src/multireducer';
import {multireducerWrapAction} from '../src/multireducerBindActionCreators'
import key from '../src/key';
import counter from './counter';
import {increment, decrement} from './counter';

const reducer = multireducer({
  a: counter,
  b: counter,
  c: counter
});
const incrementA = multireducerWrapAction(increment(), 'a');
const incrementB = multireducerWrapAction(increment(), 'b');
const incrementC = multireducerWrapAction(increment(), 'c');

const decrementA = multireducerWrapAction(decrement(), 'a');
const decrementB = multireducerWrapAction(decrement(), 'b');
const decrementC = multireducerWrapAction(decrement(), 'c');

describe('multireducer', () => {
  it('should initialize properly', () => {
    expect(reducer()).toEqual({
      a: {count: 0},
      b: {count: 0},
      c: {count: 0}
    });
  });

  it('should not respond to unbound action', () => {
    const state = {
      a: {count: 5},
      b: {count: 69},
      c: {count: 0}
    };
    expect(reducer(state, increment()))
      .toEqual(state);
    expect(reducer(state, decrement()))
      .toEqual(state);
  });

  it('should direct action based on key', () => {
    const state = {
      a: {count: 5},
      b: {count: 69},
      c: {count: 0}
    };

    expect(reducer(state, incrementA))
      .toEqual({
        a: {count: 6},
        b: {count: 69},
        c: {count: 0}
      });
    expect(reducer(state, incrementB))
      .toEqual({
        a: {count: 5},
        b: {count: 70},
        c: {count: 0}
      });
    expect(reducer(state, incrementC))
      .toEqual({
        a: {count: 5},
        b: {count: 69},
        c: {count: 1}
      });
    expect(reducer(state, decrementA))
      .toEqual({
        a: {count: 4},
        b: {count: 69},
        c: {count: 0}
      });
    expect(reducer(state, decrementB))
      .toEqual({
        a: {count: 5},
        b: {count: 68},
        c: {count: 0}
      });
    expect(reducer(state, decrementC))
      .toEqual({
        a: {count: 5},
        b: {count: 69},
        c: {count: -1}
      });
  });
});
