import key from './key';
import { bindActionCreators } from 'redux';

export function multireducerWrapAction(action, multireducerKey) {
  const markTypeWitKey = type => type + key + multireducerKey;

  if (action.types) {
    return {
      ...action,
      types: action.types.map(markTypeWitKey)
    };
  }
  return {
    ...action,
    type: markTypeWitKey(action.type)
  };
}

export default function multireducerBindActionCreators(multireducerKey, actionCreators, dispatch) {
  const wrappingDispatch = (action) => {
    if (typeof action === 'function') {
      const wrappedThunk = (globalDispatch, getState) => action(wrappingDispatch, getState, globalDispatch, multireducerKey);
      return dispatch(wrappedThunk);
    } else if (typeof action === 'object') {
      return dispatch(multireducerWrapAction(action, multireducerKey));
    }
  };

  return bindActionCreators(actionCreators, wrappingDispatch);
}
