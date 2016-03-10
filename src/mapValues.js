import immutable from 'immutable';

/**
 * Maps all the values in the given object through the given function and saves them, by key, to a result object
 */
export default function mapValues(obj, fn) {
  if (immutable.Iterable.isIterable(obj)) {
    return obj.reduce(
      (reduction, value, key) => reduction.set(key, fn(value, key)),
      immutable.Map() // eslint-disable-line new-cap
    );
  }
  return Object.keys(obj).reduce((accumulator, key) => ({
    ...accumulator,
    [key]: fn(obj[key], key)
  }), {});
}
