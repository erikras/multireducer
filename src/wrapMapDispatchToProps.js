import multireducerBindActionCreators from './multireducerBindActionCreators';

const wrapMapDispatchToProps = (mapDispatchToProps, multireducerKey) => {
  if (mapDispatchToProps) {
    if (typeof mapDispatchToProps === 'function') {
      if (mapDispatchToProps.length > 2) {
        return (dispatch, ownProps) => ({
          dispatch,
          ...mapDispatchToProps(multireducerKey, dispatch, ownProps)
        });
      }
      return dispatch => ({
        dispatch,
        ...mapDispatchToProps(multireducerKey, dispatch)
      });
    }
    return dispatch => ({
      dispatch,
      ...multireducerBindActionCreators(multireducerKey, mapDispatchToProps, dispatch)
    });
  }
  return dispatch => ({
    dispatch
  });
};

export default wrapMapDispatchToProps;
