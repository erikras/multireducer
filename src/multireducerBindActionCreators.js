import key from './key';
import {bindActionCreators} from 'redux';

export function multireducerWrapAction(action, multireducerKey) {
  if (action.types) {
    return {
      ...action,
      types: action.types.map(type => type + key + multireducerKey)
    };
  }
  return {
    ...action,
    type: (action.type || '') + key + multireducerKey
  };
}

export default function multireducerBindActionCreators(multireducerKey, actionCreators, dispatch) {
  const wrappingDispatch = (action) => {
    if (typeof action === 'function') {
      const wrappedThunk = (ignoredDispatch, getState) => action(wrappingDispatch, getState, ignoredDispatch);
      return dispatch(wrappedThunk);
    } else if (typeof action === 'object') {
      return dispatch(multireducerWrapAction(action, multireducerKey));
    }
  };

  return bindActionCreators(actionCreators, wrappingDispatch);
}
