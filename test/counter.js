// Welcome, curious code explorer!! This is a duck. https://github.com/erikras/ducks-modular-redux

const INCREMENT = 'multireducer/counter/INCREMENT';
const DECREMENT = 'multireducer/counter/DECREMENT';

const initialState = {
  count: 0
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        count: state.count + 1
      };
    case DECREMENT:
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}

export function increment() {
  return {
    type: INCREMENT
  };
}

export function decrement() {
  return {
    type: DECREMENT
  };
}
