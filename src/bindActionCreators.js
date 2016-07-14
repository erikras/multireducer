import { bindActionCreators as originalBindActionCreator } from 'redux';
import wrapDispatch from './wrapDispatch';


export default function bindActionCreators(actionCreators, dispatch, reducerKey) {
  const wrappedDispatch = wrapDispatch(dispatch, reducerKey);
  return originalBindActionCreator(actionCreators, wrappedDispatch);
}
