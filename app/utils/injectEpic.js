import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

import getInjectors from './epicInjectors';

/**
 * Dynamically injects an epic
 *
 * @param {string} key A key of the epic
 * @param {function} epic A epic that will be injected
 *
 */
export default ({ key, epic }) => (WrappedComponent) => {
  class EpicInjector extends React.Component {
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };
    static displayName = `withEpic(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

    componentWillMount() {
      const { injectEpic } = this.injectors;

      injectEpic(key, epic);
    }

    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(EpicInjector, WrappedComponent);
};
