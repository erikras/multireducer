import { bindActionCreators as originalBindActionCreator } from 'redux';
import wrapDispatch from './wrapDispatch';


export default function bindActionCreators(actionCreators, dispatch, multireducerKey) {
  const wrappedDispatch = wrapDispatch(dispatch, multireducerKey);
  return originalBindActionCreator(actionCreators, wrappedDispatch);
}
