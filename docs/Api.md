# API

* [multireducer](#multireducer)
* [bindActionCreators](#bindActionCreators)
* [wrapDispatch](#wrapDispatch)
* [wrapAction](#wrapAction)

## multireducer(reducers, [reducerKey])

Wraps many (or single) reducers into one, much like Redux's `combineReducers()` does, except that the reducer that `multireducer` creates will filter your actions by a `reducerKey`, so that the right reducer gets the action.

### Arguments

* `reducers : (Object or Function) [required]`

If an object is passed, each function inside it will be assumed to be a reducer. A corresponding property names in this object will be used as a `reducerKey` for reducers. You will specify `reducerKey` as property of the component. If a function is passed, it should be a reducer. In this case you must specify second parameter `reducerKey`.

* `reducerKey : (String) [optional]`

This parameter will be used as `reducerKey`'s value for connected single reducer.

## bindActionCreators(actions, dispatch, reducerKey)

### Arguments

* `actions : Object [required]`

Object with actions you'd like to be bound to dispatch

* `dispatch : Function [required]`

A 'global' dispatch you take from `mapDispatchToProps`

* `reducerKey : String [required]`

Specify the key that will be added to dispathed actions types.

## wrapDispatch(dispatch, reducerKey)

Wrap Redux's dispatch.

### Arguments

* `dispatch : Function [required]`

Redux's dispatch.

* `reducerKey : String [required]`

### Example

```javascript
import { wrapDispatch } from 'multireducer'
import { add, remove } from './actions/list'

wrapDispatch(dispatch, 'additional')(add)
```

## wrapAction(action, reducerKey)

Wrap a Redux's `action` with given `reducerKey`.

### Arguments

* `action : Object [required]`

Redux's action.

* `reducerKey : String [required]`

### Example

```javascript
import { wrapAction } from 'multireducer'

// say we have a mapDispatchToProps function
function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(wrapAction({ type: 'SOME_ACTION' }, 'reducerKey'))
  }
}

```
