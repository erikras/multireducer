import expect from 'expect';
import {fromJS} from 'immutable';
import multireducer from '../src/multireducer';
import {multireducerWrapAction} from '../src/multireducerBindActionCreators'
import key from '../src/key';
import * as counter from './counter';

const incrementA = multireducerWrapAction(counter.increment(), 'a');
const incrementB = multireducerWrapAction(counter.increment(), 'b');
const incrementC = multireducerWrapAction(counter.increment(), 'c');

const decrementA = multireducerWrapAction(counter.decrement(), 'a');
const decrementB = multireducerWrapAction(counter.decrement(), 'b');
const decrementC = multireducerWrapAction(counter.decrement(), 'c');

describe('multireducer', () => {
  describe('(with POJO)', () => {
    const reducer = multireducer({
      a: counter.reducer,
      b: counter.reducer,
      c: counter.reducer
    });
    it('should initialize properly', () => {
      expect(reducer()).toEqual({
        a: {count: 0},
        b: {count: 0},
        c: {count: 0}
      });
    });

    it('should throw an error if you use custom mount point and reducerKey is not specified', () =>{
        const errorMessage = `No key specified for custom mounting of reducer`
        expect(() => multireducer(counter.reducer)).toThrow(errorMessage);
    });

    it('should respond to actions when mounted as a single reducer', () => {

      const reducer = multireducer(counter.reducer, 'a');

      let state = {
        count: 5
      };

      expect(reducer(state, incrementA))
        .toEqual({
          count: 6
        });

      state = {
        count: 11
      };

      expect(reducer(state, decrementA))
        .toEqual({
          count: 10
        });
    });

    it('should not respond to unbound action', () => {
      const state = {
        a: {count: 5},
        b: {count: 69},
        c: {count: 0}
      };
      expect(reducer(state, counter.increment()))
        .toEqual(state);
      expect(reducer(state, counter.decrement()))
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

  describe('(with immutable)', () => {
    const reducer = multireducer(fromJS({
      a: counter.reducerImmutable,
      b: counter.reducerImmutable,
      c: counter.reducerImmutable
    }));

    it('should initialize properly', () => {
      expect(reducer()).toEqual(fromJS({
        a: {count: 0},
        b: {count: 0},
        c: {count: 0}
      }));
    });

    it('should throw an error if you use custom mount point and reducerKey is not specified', () => {
      const errorMessage = `No key specified for custom mounting of reducer`;

      expect(() => multireducer(counter.reducerImmutable)).toThrow(errorMessage);
    });

    it('should respond to to actions when mounted as a single reducer', () => {
        const reducer = multireducer(counter.reducerImmutable, 'a');
        let state;

        state = fromJS({
            count: 5
        });
        expect(reducer(state, incrementA).toJS())
          .toEqual({
            count: 6
          });

        state = fromJS({
            count: 11
        });
        expect(reducer(state, decrementA).toJS())
          .toEqual({
            count: 10
          })
    });

    it('should not respond to unbound action', () => {
        const state = fromJS({
          a: {count: 5},
          b: {count: 69},
          c: {count: 0}
        });

        expect(reducer(state, counter.increment()))
          .toEqual(state);
        expect(reducer(state, counter.decrement()))
          .toEqual(state);
    });

    it('should direct action based on key', () => {
      const state = fromJS({
        a: {count: 5},
        b: {count: 69},
        c: {count: 0}
      });

      expect(reducer(state, incrementA))
        .toEqual(fromJS({
          a: {count: 6},
          b: {count: 69},
          c: {count: 0}
        }));
      expect(reducer(state, incrementB))
        .toEqual(fromJS({
          a: {count: 5},
          b: {count: 70},
          c: {count: 0}
        }));
      expect(reducer(state, incrementC))
        .toEqual(fromJS({
          a: {count: 5},
          b: {count: 69},
          c: {count: 1}
        }));
      expect(reducer(state, decrementA))
        .toEqual(fromJS({
          a: {count: 4},
          b: {count: 69},
          c: {count: 0}
        }));
      expect(reducer(state, decrementB))
        .toEqual(fromJS({
          a: {count: 5},
          b: {count: 68},
          c: {count: 0}
        }));
      expect(reducer(state, decrementC))
        .toEqual(fromJS({
          a: {count: 5},
          b: {count: 69},
          c: {count: -1}
        }));
    });

  });
});
