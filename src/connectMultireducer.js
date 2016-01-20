import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

export default function connectMultireducer(mapStateToProps, mapDispatchToProps, ...rest) {
  return DecoratedComponent => {
    class ConnectMultireducer extends Component {
      static displayName = `ConnectMultireducer(${getDisplayName(DecoratedComponent)})`;
      static propTypes = {
        multireducerKey: PropTypes.string.isRequired
      }

      componentWillMount() {
        this.generateConnectedComponent(this.props);
      }

      componentWillReceiveProps(nextProps) {
        if (this.props.multireducerKey !== nextProps.multireducerKey) {
          this.generateConnectedComponent(nextProps);
        }
      }
      static DecoratedComponent = DecoratedComponent;

      generateConnectedComponent({multireducerKey}) {
        this.ConnectedComponent =
          connect(
            (state, ownProps) => mapStateToProps(multireducerKey, state, ownProps),
            dispatch => mapDispatchToProps(multireducerKey, dispatch),
            ...rest
          )(DecoratedComponent);
      }

      render() {
        const {ConnectedComponent} = this;
        return <ConnectedComponent {...this.props}/>;
      }
    }
    return ConnectMultireducer;
  };
}
