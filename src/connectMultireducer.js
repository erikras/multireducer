import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import multireducerBind from './multireducerBind';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

export default function connectMultireducer(mapStateToProps, actions = {}) {
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
            (state, ownProps) => {
              const multireducerKeys = Object.keys(state.multireducer);
              if (!multireducerKeys.find(key => key === multireducerKey)) {
                throw new Error(`No state for multireducer key "${multireducerKey}". You initialized multireducer with "${multireducerKeys.join(', ')}".`);
              }
              const slice = state.multireducer[multireducerKey];
              return mapStateToProps ? mapStateToProps(slice, ownProps) : slice;
            },
            multireducerBind(actions, multireducerKey)
          )(DecoratedComponent);
      }

      render() {
        const {multireducerKey, ...props} = this.props;
        const {ConnectedComponent} = this;
        return <ConnectedComponent {...props}/>;
      }
    }
    return ConnectMultireducer;
  };
}
