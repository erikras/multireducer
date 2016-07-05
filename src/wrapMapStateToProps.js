import immutable from 'immutable';

const wrapMapStateToProps = (mapStateToProps, multireducerKey) => {
  if (mapStateToProps) {
    if (typeof mapStateToProps !== 'function') {
      throw new Error('mapStateToProps must be a function');
    }
    if (mapStateToProps.length > 2) {
      return (state, ownProps) => {
        if (immutable.Iterable.isIterable(state)) {
          return mapStateToProps(multireducerKey, state, ownProps);
        }
        return {
          ...mapStateToProps(multireducerKey, state, ownProps)
        };
      };
    }
    return state => {
      if (immutable.Iterable.isIterable(state)) {
        return mapStateToProps(multireducerKey, state);
      }
      return {
        ...mapStateToProps(multireducerKey, state),
      };
    };
  }
  return () => ({ });
};

export default wrapMapStateToProps;
