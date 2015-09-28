#multireducer

[![NPM Version](https://img.shields.io/npm/v/multireducer.svg?style=flat-square)](https://www.npmjs.com/package/multireducer) 
[![NPM Downloads](https://img.shields.io/npm/dm/multireducer.svg?style=flat-square)](https://www.npmjs.com/package/multireducer)
[![Build Status](https://img.shields.io/travis/erikras/multireducer/master.svg?style=flat-square)](https://travis-ci.org/erikras/multireducer)

`multireducer` is a utility to wrap many copies of a single Redux reducer a single key-based reducer.

## Installation

```
npm install --save multireducer
```

## Why?

There are times when writing a Redux application where you might find yourself needing multiple copies of the same reducer. For example, you might need more than one list of the same type of object to be displayed. Rather than make a big reducer to handle list `A`, `B`, and `C`, and have action creators either in the form `addToB(item)` or `addToList('B', item)`, it would be easier to write one "list" reducer, which is easier to write, reason about, and test, with a simpler `add(item)` API. 

However, Redux won't let you do this:

```
import list from './reducers/list';

const reducer = combineReducers({
  a: list,		// WRONG
  b: list,		// WRONG
  c: list		// WRONG
});
```

Each of those reducers is going to respond the same to every action.

This is where `multireducer` comes in. Multireducer lets you mount the same reducer any number of times in your Redux state tree, as long as you pass the key that you mounted it on to your connected component.

## How It Works

**STEP 1:** First you will need to wrap the reducer you want to copy.

```
import multireducer from 'multireducer';
import list from './reducers/list';

const reducer = combineReducers({
  lists: multireducer({
    proposed  : list,
    scheduled : list,
    active    : list,
    complete  : list
  })
});
```

**STEP 2:** Now use `connectMultireducer()` instead of `react-redux`'s `connect()` to connect your component to the Redux store.

```
import React, {Component, PropTypes} from 'react';
import {connectMultireducer} from 'multireducer';
import {add, remove} from './actions/list';

class ListComponent extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired
  }
  
  render() {
    const {add, list, remove} = this.props;
    return (
      <div>
        <button onClick={() => add('New Item')}>Add</button>
        <ul>
          {list.map((item, index) => 
            <li key={index}>
              {item}
              (<button onClick={() => remove(item)}>X</button>)
            </li>)}
        </ul>
      </div>
    );
  }
}

ListComponent = connectMultireducer(
  state => ({ list: state.list }),
  {add, remove}
)(ListComponent);

export default ListComponent;
```

**STEP 3:** Pass the appropriate `multireducerKey` prop to your decorated component.

```
render() {
  return (
    <div>
      <h1>Lists</h1>
      <ListComponent multireducerKey="proposed"/>
      <ListComponent multireducerKey="scheduled"/>
      <ListComponent multireducerKey="active"/>
      <ListComponent multireducerKey="complete"/>
    </div>
  );
}
```

## API

### `multireducer(reducers:Object) : Function`

Wraps many reducers into one, much like Redux's `combineReducers()` does, except that the reducer that `multireducer` creates will filter your actions by a `multireducerKey`, so that the right reducer gets the action.

### `connectMultireducer(mapStateToProps:Function?, actions:Object?) : Function`

Creates a higher order component decorator, much like [`react-redux`](https://github.com/rackt/react-redux)'s [`connect()`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options), that will provide your reducer's state slice, automatically bind your actions to `dispatch`, and add the needed filter to each of your actions so that they will go to the correct reducer.

##### -`mapStateToProps : Function` [optional]

> Similar to the `mapStateToProps` passed to `react-redux`'s [`connect()`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options), **_BUT WITH ONE DIFFERENCE_**: :warning: The `mapStateToProps` given to `connect()` is given the global state, and the `mapStateToProps` given to `connectMultireducer()` is given _only the state slice corresponding to the reducer specified by `multireducerKey`_. :warning: 

### Props to your decorated component

#### -`multireducerKey : String` [required]

> The key to the reducer in the `reducers` object given to `multireducer()`. This will limit its state and actions to the corresponding reducer.


## Working Example

The [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example) project uses `multireducer`. See its [`reducer.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/reducer.js), which combines the plain vanilla [`counter.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/counter.js) [duck](https://github.com/erikras/ducks-modular-redux), to a multireducer. The [`CounterButton.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/components/CounterButton/CounterButton.js) connects to the multireducer, and the [`Home.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/containers/Home/Home.js) calls `<CounterButton/>` with a `multireducerKey` prop.