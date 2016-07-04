import key from './key';

export default function wrapAction(action, multireducerKey) {
  const markTypeWithKey = type => type + key + multireducerKey;

  if (action.types) {
    return {
      ...action,
      types: action.types.map(markTypeWithKey)
    };
  }

  return {
    ...action,
    type: markTypeWithKey(action.type)
  };
}
