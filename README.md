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

**STEP 2:** Now use `multireducer`'s `bindActionCreators()` instead of `react-redux`'s `bindActionCreators()` to make your action multireducerify. You have to specify which part of state contains data for your copied reducers and then access it using the `multireducerKey` prop you pass to the connected component, here I recommand `as`. And you have to tell `bindActionCreators` what is your `multireducerKey` too.

```javascript
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'multireducer';
import { add, remove } from './actions/list';

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

const mapStateToProps = (state, { as }) => ({ list: state.listCollection[as] });

const mapDispatchToProps = (dispatch, { as }) => bindActionCreators({ add, remove }, dispatch, as)

ListComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent);

export default ListComponent;
```

Or if you mounted one copy of reducer, access needed part of state directly. And tell `bindActionCreators` what is your `multireducerKey`, in this example it should be 'additional'.

```javascript
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'multireducer';
import { add, remove } from './actions/list';

...

const mapStateToProps = state => ({ list: state.myList });
const mapDispatchToProps = dispatch => bindActionCreators({ add, remove }, dispatch, 'additional');

ListComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent);

export default ListComponent;
```

**STEP 3:** Pass the appropriate `multireducerKey` prop to your decorated component, you can name it whaterver you want.

```javascript
render() {
  return (
    <div>
      <h1>Lists</h1>
      <ListComponent as="proposed"/>
      <ListComponent as="scheduled"/>
      <ListComponent as="active"/>
      <ListComponent as="complete"/>
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

### `bindActionCreators(actions, dispatch, multireducerKey) : Function`

##### -`actions : Object`
> Object with actions you'd like to be bound to dispatch

##### -`dispatch : String`
> A 'global' dispatch you take from `mapDispatchToProps`

##### -`multireducerKey : String`
> specify the key that will be added to dispathed actions types.

## Working Example

The [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example) project uses `multireducer`. See its [`reducer.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/reducer.js), which combines the plain vanilla [`counter.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/modules/counter.js) [duck](https://github.com/erikras/ducks-modular-redux), to a multireducer. The [`CounterButton.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/components/CounterButton/CounterButton.js) connects to the multireducer, and the [`Home.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/containers/Home/Home.js) calls `<CounterButton/>` with a `multireducerKey` prop.

[Example](https://github.com/jsdmc/react-redux-router-crud-boilerplate) with [multiple counters](https://github.com/jsdmc/react-redux-router-crud-boilerplate/blob/master/src/redux-base/modules/reducer.js) and [ducks](https://github.com/erikras/ducks-modular-redux) [composition](https://github.com/jsdmc/react-redux-router-crud-boilerplate/blob/master/src/redux-base/modules/customCounter.js).
