const wrapMapStateToProps = (mapStateToProps, multireducerKey) => {
  if (mapStateToProps) {
    if (typeof mapStateToProps !== 'function') {
      throw new Error('mapStateToProps must be a function');
    }
    if (mapStateToProps.length > 2) {
      return (state, ownProps) => ({
        ...mapStateToProps(multireducerKey, state, ownProps),
      });
    }
    return state => ({
      ...mapStateToProps(multireducerKey, state),
    });
  }
  return () => ({ });
};

export default wrapMapStateToProps;
