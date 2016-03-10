import immutable from 'immutable';

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
    if (action && action.type && ~action.type.indexOf(key)) {
      const keyStart = action.type.indexOf(key);
      const keyOnward = action.type.substring(keyStart);
      const actionReducerKey = keyOnward.substring(key.length);

      const actionWithoutKey = {
        ...action,
        type: action.type.substring(0, keyStart)
      };

      // custom mount point
      if (isCustomMountPoint && reducerKey === actionReducerKey) {
        const newStateValue = reducers(state, actionWithoutKey);

        // state is object
        if (immutable.Iterable.isIterable(newStateValue)) {
          return newStateValue;
        } else if (typeof newStateValue === 'object') {
          return {
            ...state,
            ...newStateValue
          };
        }
        // case for simple state slices (numbers, strings etc.)
        return newStateValue;
      }

      // usual multireducer mounting
      if (immutable.Iterable.isIterable(reducers)) {
        const reducer = reducers.get(actionReducerKey);

        if (reducer) {
          return state.update(actionReducerKey, oldValue => reducer(oldValue, actionWithoutKey));
        }
      } else {
        const reducer = reducers[actionReducerKey];

        if (reducer) {
          return {
            ...state,
            [actionReducerKey]: reducer(state[actionReducerKey], actionWithoutKey)
          };
        }
      }
    }

    return state;
  };
}
