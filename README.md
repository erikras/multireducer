#multireducer

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

## How It Works

**STEP 1:** First you will need to wrap the reducer you want to copy.

```javascript
import multireducer from 'multireducer';
import list from './reducers/list';

const reducer = combineReducers({
  listCollection: multireducer({ // can be mounted as any property. Later you can use this prop to access state slices in mapStateToProps
    proposed  : list,
    scheduled : list,
    active    : list,
    complete  : list
  })
});
```

Or if you need just one copy of reducer without additional nested property in state

```javascript
const reducer = combineReducers({
  myList: multireducer(list, 'additional') // second argument is a reducer key, which is used as identifier for dispatching actions
});
```

**STEP 2:** Now use `connectMultireducer()` instead of `react-redux`'s `connect()` to connect your component to the Redux store. You have to specify which part of state contains data for your copied reducers and then access it using dynamic `key` paremeter that will be equal to `multireducerKey` prop of connected component

```javascript
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

const mapStateToProps = (key, state) => ({ list: state.listCollection[key] });

const mapDispatchToProps = {add, remove};

ListComponent = connectMultireducer(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent);

export default ListComponent;
```

Or if you mounted one copy of reducer, access needed part of state directly. Parameter `key` for `mapStateToProps` will be equal to 'additional' from example above. In such cases it may be not used and actually you can use standard `connect()` from 'react-redux'.

```javascript
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {add, remove} from './actions/list';

...

const mapStateToProps = (state) => ({ list: state.myList });
const mapDispatchToProps = dispatch => {
  return multireducerBindActionCreators('additional', {add, remove}, dispatch);
}
ListComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent);

export default ListComponent;
```

**STEP 3:** Pass the appropriate `multireducerKey` prop to your decorated component.

```javascript
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

### `multireducer(reducers, [reducerKey]) : Function`

Wraps many (or single) reducers into one, much like Redux's `combineReducers()` does, except that the reducer that `multireducer` creates will filter your actions by a `multireducerKey`, so that the right reducer gets the action.

##### -`reducers : (Object or Function)` [required]
> If an object is passed, each function inside it will be assumed to be a reducer. A corresponding property names in this object will be used as a `multireducerKey` for reducers. You will specify `multireducerKey` as property of the component that is connected using `connectMultireducer`. If a function is passed, it should be a reducer. In this case you must specify second parameter `reducerKey`.

##### -`reducerKey : (String)` [optional]
> This parameter will be used as `multireducerKey` for connected single  reducer.

### `connectMultireducer([mapStateToProps], [mapDispatchToProps], [mergeProps], [options]) : Function`

Creates a higher order component decorator, much like [`react-redux`](https://github.com/rackt/react-redux)'s [`connect()`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options), but will provide reducer's key as fisrt parameter to `mapStateToProps` and to `mapDispatchToProps`(if it's a function), automatically bind your actions to `dispatch` if `mapDispatchToProps` is a hash of actions, and add the needed filter to each of your actions so that they will go to the correct reducer.

##### -`mapStateToProps(key, state, [ownProps]) : Function` [optional]

> Similar to the `mapStateToProps` passed to `react-redux`'s [`connect()`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options), **_BUT WITH ONE DIFFERENCE_**: :warning: The `mapStateToProps` given to `connectMultireducer()` has first parameter `key` that is equal to `multireducerKey` prop of connected component. You have to use `key` to access _state slice corresponding to the reducer specified by `multireducerKey`_. :warning: 

##### -`mapDispatchToProps(key, dispatch, [ownProps]) : Object or Function` [optional]

> Similar to the `mapDispatchToProps` passed to `react-redux`'s [`connect()`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options). If it's function - it's first parameter `key` corresponds to `multireducerKey` for connected component. You can use `multireducerBindActionCreators` for manual binding actions with 'key' and combine with [`bindActionCreators()`](http://rackt.github.io/redux/docs/api/bindActionCreators.html) helper from Redux. If it's object, every action insice will be bound to dispatch and will have modified have modified `type`

```javascript
// original action
{ type: 'UPDATE_LIST', ...}

// action fired using mapped action creators
{ type: 'UPDATE_LIST__multireducerKey=proposed', ...}
```

### `multireducerBindActionCreators(reducerKey, actions, dispatch) : Function`

##### -`reducerKey : String`
> Reducer key that you can take as 1st param `key` from `mapDispatchToProps`, or specify any other key that will be added to dispathed actions types.

##### -`actions : Object`
> Object with actions you'd like to be bound to dispatch

##### -`dispatch : String`
> A 'global' dispatch you take from `mapDispatchToProps`

Example 
```javascript
import { bindActionCreators } from 'redux';
import { multireducerBindActionCreators } from 'multireducer';
import * as BaseListActions from 'redux-base/modules/list';
import * as ProposedListActions from 'redux-base/modules/proposedList';

const mapDispatchToProps = (key, dispatch) => {
  return {
    ...bindActionCreators(BaseListActions, dispatch),
    ...multireducerBindActionCreators(key, ProposedListActions, dispatch)
  };
};
```

### Props to your decorated component

#### -`multireducerKey : String` [required]

> The key to the reducer in the `reducers` object given to `multireducer()`. This will limit its state and actions to the corresponding reducer.


## Working Example

The [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example) project uses `multireducer`. See its [`reducer.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/reducer.js), which combines the plain vanilla [`counter.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/counter.js) [duck](https://github.com/erikras/ducks-modular-redux), to a multireducer. The [`CounterButton.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/components/CounterButton/CounterButton.js) connects to the multireducer, and the [`Home.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/containers/Home/Home.js) calls `<CounterButton/>` with a `multireducerKey` prop.

[Example](https://github.com/jsdmc/react-redux-router-crud-boilerplate) with [multiple counters](https://github.com/jsdmc/react-redux-router-crud-boilerplate/blob/master/src/redux-base/modules/reducer.js) and [ducks](https://github.com/erikras/ducks-modular-redux) [composition](https://github.com/jsdmc/react-redux-router-crud-boilerplate/blob/master/src/redux-base/modules/customCounter.js).
