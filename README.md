# multireducer

[![NPM Version](https://img.shields.io/npm/v/multireducer.svg?style=flat-square)](https://www.npmjs.com/package/multireducer)
[![NPM Downloads](https://img.shields.io/npm/dm/multireducer.svg?style=flat-square)](https://www.npmjs.com/package/multireducer)
[![Build Status](https://img.shields.io/travis/erikras/multireducer/master.svg?style=flat-square)](https://travis-ci.org/erikras/multireducer)

`multireducer` is a utility to wrap many copies of a single Redux reducer into a single key-based reducer.

## Installation

```
npm install --save multireducer
```

## Why?

There are times when writing a Redux application where you might find yourself needing multiple copies of the same reducer. For example, you might need more than one list of the same type of object to be displayed. Rather than make a big reducer to handle list `A`, `B`, and `C`, and have action creators either in the form `addToB(item)` or `addToList('B', item)`, it would be easier to write one "list" reducer, which is easier to write, reason about, and test, with a simpler `add(item)` API.

However, Redux won't let you do this:

```javascript
import list from './reducers/list';

const reducer = combineReducers({
  a: list,		// WRONG
  b: list,		// WRONG
  c: list		// WRONG
});
```

Each of those reducers is going to respond the same to every action.

This is where `multireducer` comes in. Multireducer lets you mount the same reducer any number of times in your Redux state tree, as long as you pass the key that you mounted it on to your connected component.


Read the full [API Documentation](/docs)

## Working Example

The [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example) project uses `multireducer`. See its [`reducer.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/reducer.js), which combines the plain vanilla [`counter.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/counter.js) [duck](https://github.com/erikras/ducks-modular-redux), to a multireducer. The [`CounterButton.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/components/CounterButton/CounterButton.js) connects to the multireducer, and the [`Home.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/containers/Home/Home.js) calls `<CounterButton/>` with a `multireducerKey` prop.

[Example](https://github.com/jsdmc/react-redux-router-crud-boilerplate) with [multiple counters](https://github.com/jsdmc/react-redux-router-crud-boilerplate/blob/master/src/redux-base/modules/reducer.js) and [ducks](https://github.com/erikras/ducks-modular-redux) [composition](https://github.com/jsdmc/react-redux-router-crud-boilerplate/blob/master/src/redux-base/modules/customCounter.js).
