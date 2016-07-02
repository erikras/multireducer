import mapValues from './mapValues';
import key from './key';

export default function multireducer(reducers, reducerKey) {
  let isCustomMountPoint;
  if (typeof reducers === 'function') {
    if (!reducerKey) {
      throw new Error(`No key specified for custom mounting of reducer`);
    } else {
      isCustomMountPoint = true;
    }
  }

  const initialState = isCustomMountPoint ? reducers(undefined, {}) : mapValues(reducers, reducer => reducer(undefined, {}));

  return (state = initialState, action) => {
    if (action && action.meta && action.meta[key]) {
      const actionReducerKey = action.meta[key];

      // custom mount point
      if (isCustomMountPoint && reducerKey === actionReducerKey) {
        const newStateValue = reducers(state, action);

        // state is object
        if (typeof newStateValue === 'object') {
          return {
            ...state,
            ...newStateValue
          };
        }
        // case for simple state slices (numbers, strings etc.)
        return newStateValue;
      }

      // usual multireducer mounting
      const reducer = reducers[actionReducerKey];

      if (reducer) {
        return {
          ...state,
          [actionReducerKey]: reducer(state[actionReducerKey], action)
        };
      }
    }

    return state;
  };
}
