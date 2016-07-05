## Usage

**STEP 1:** First you will need to wrap the reducer you want to copy.

```javascript
import multireducer from 'multireducer';
// In case you are using Immutable.js, you can:
// import multireducer from 'multireducer/immutable'
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

**STEP 2:** Now use `multireducer`'s `bindActionCreators()` instead of `react-redux`'s `bindActionCreators()` to make your action multireducerify. You have to specify which part of state contains data for your copied reducers and then access it using the `reducerKey` you pass to the connected component, here I recommand `as` for the `reducerKey`'s props name. And you have to tell `bindActionCreators` what is your `reducerKey` too.

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

Or if you mounted one copy of reducer, access needed part of state directly. And tell `bindActionCreators` what is your `reducerKey`, in this example it should be 'additional'.

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

**STEP 3:** Pass the appropriate `reducerKey` prop to your decorated component, you can name it whaterver you want.

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

