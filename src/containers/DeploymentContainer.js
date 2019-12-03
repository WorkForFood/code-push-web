import React, {PropTypes, Component} from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as usersActions from '../actions/usersActions';
import * as authActions from '../actions/authActions';
import * as routesActions from '../actions/routesActions';
import * as productsActions from '../actions/productsActions';
import Deployment from '../components/Deployment';

class DeploymentContainer extends Component {
  componentDidMount() {
    if (!_.get(this.props, 'auth.isAuth')) {
      let path = location.pathname;
      if (!_.isEmpty(location.search)) {
        path += `?${location.search}`
      }
      // console.log(path);
      this.props.actions.setBackHistory(path);
      this.props.actions.fetchAuth(true);
    }
  }
  render() {
    const {appName, deploymentName, deploymentHistory} = this.props;
    return (
      <Deployment
       appName={appName}
       deploymentName={deploymentName}
       history={_.get(deploymentHistory, `rs.${appName}`)} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    'auth': _.get(state, 'auth', {}),
    'deploymentHistory': _.get(state, 'deploymentHistory', {})
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
)(DeploymentContainer)
