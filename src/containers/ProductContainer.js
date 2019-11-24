import React, {PropTypes, Component} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as usersActions from '../actions/usersActions';
import * as authActions from '../actions/authActions';
import * as routesActions from '../actions/routesActions';
import * as productsActions from '../actions/productsActions';
import Product from '../components/Product';

class ProductContainer extends Component {
  static propTypes = {
    appName: PropTypes.string
  };

  static defaultProps = {
    appName: '',
  };

  componentDidMount() {
    if (!_.get(this.props, 'auth.isAuth')) {
      let path = location.pathname;
      if (!_.isEmpty(location.search)) {
        path += `?${location.search}`
      }
      this.props.actions.setBackHistory(path);
      this.props.actions.fetchAuth(true);
    }
  }
  render() {
    const {deployments, appName, actions } = this.props;
    return (
      <Product
      appName={appName}
      items={_.get(deployments, `rs.${appName}`)}
      promoteDeployment={(appName, srcDeploymentName, dstDeploymentName, packageInfo)=>actions.promoteDeployment(appName, srcDeploymentName, dstDeploymentName, packageInfo)}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    'auth': _.get(state, 'auth', {}),
    'deployments': _.get(state, 'deployments', {})
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: bindActionCreators(Object.assign({}, usersActions, authActions, routesActions, productsActions), dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductContainer)
