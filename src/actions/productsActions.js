import _ from 'lodash';

import * as types from './actionTypes';
import restApi from '../network/RestApi';
import {checkResponseAuth} from './authActions';
import {addShowMsg} from './msgStackActions';

export function requestProducts() {
  return {
    type: types.REQUEST_PRODUCTS,
  }
}

export function receiveProducts(data) {
  return {
    type: types.RECEIVE_PRODUCTS,
    payload: data
  }
}

export function getProducts() {
  return (dispatch) => {
    dispatch(requestProducts());
    return restApi.getProducts()
    .then(data => {
      checkResponseAuth(dispatch, data);
      dispatch(receiveProducts(data));
    });
  };
}

export function showPopAddApp() {
  return {type: types.SHOW_POP_ADD_APP};
}

export function closePopAddApp() {
  return {type: types.CLOSE_POP_ADD_APP};
}

export function popAddAppInput(params) {
  return {
    type: types.POP_ADD_APP_INPUT,
    payload : params
  }
}

export function requestAddProducts() {
  return {
    type: types.REQUEST_ADD_PRODUCTS,
  }
}

export function receiveAddProducts(data) {
  return {
    type: types.RECEIVE_ADD_PRODUCTS,
    payload: data
  }
}

export function addProducts(appName, os, platform) {
  return (dispatch) => {
    dispatch(requestAddProducts());
    return restApi.addProducts(appName, os, platform)
    .then(data => {
      checkResponseAuth(dispatch, data);
      if (_.get(data, 'status') !== "OK") {
        dispatch(addShowMsg("创建应用: "+_.get(data,'errorMessage'), "danger"));
      } else {
        dispatch(addShowMsg("创建 "+_.get(data,'results.app.name')+" 应用成功", "success"));
      }
      dispatch(receiveAddProducts(data));
      dispatch(getProducts());
    });
  };
}

export function requestDeployments(appName) {
  return {
    type: types.REQUEST_PRODUCTS_DEPLOYMENTS,
    payload: appName
  }
}

export function receiveDeployments(appName, data) {
  return {
    type: types.RECEIVE_PRODUCTS_DEPLOYMENTS,
    payload: {appName, ...data}
  }
}

export function fetchDeployments(appName) {
  return (dispatch) => {
    dispatch(requestDeployments(appName));
    return restApi.getDeployments(appName)
    .then(data => {
      checkResponseAuth(dispatch, data);

      dispatch(receiveDeployments(appName, data));

    });
  };
}



export function requestDeploymentByName(appName, deploymentName) {
  return {
    type: types.REQUEST_PRODUCTS_DEPLOYMENT_BY_NAME,
    payload: { appName, deploymentName }
  }
}

export function receiveDeploymentByName(appName, deploymentName, data) {
  return {
    type: types.RECEIVE_PRODUCTS_DEPLOYMENT_BY_NAME,
    payload: {appName, deploymentName, ...data}
  }
}

export function fetchDeploymentByName(appName, deploymentName) {
  return (dispatch) => {
    dispatch(requestDeploymentByName(appName, deploymentName));
    return restApi.getDeploymentByName(appName, deploymentName)
    .then(data => {
      checkResponseAuth(dispatch, data);
      dispatch(receiveDeploymentByName(appName, deploymentName, data));
    });
  };
}


export function requestDeploymentMetrics(appName, deploymentName) {
  return {
    type: types.REQUEST_PRODUCTS_DEPLOYMENT_METRICS,
    payload: { appName, deploymentName }
  }
}

export function receiveDeploymentMetrics(appName, deploymentName, data) {
  return {
    type: types.RECEIVE_PRODUCTS_DEPLOYMENT_METRICS,
    payload: {appName, deploymentName, ...data}
  }
}

export function fetchDeploymentMetrics(appName, deploymentName) {

  return (dispatch) => {
    dispatch(requestDeploymentMetrics(appName, deploymentName));
    return restApi.getDeploymentMetrics(appName, deploymentName)
    .then(data => {
      checkResponseAuth(dispatch, data);
      dispatch(receiveDeploymentMetrics(appName, deploymentName, data));
    });
  };
}

function requestPromoteDeployment(appName, deployName, dstDeploymentName, pkgdata) {
  return {
    type: types.REQUEST_PROMOTE_DEPLOYMENT,
    payload: { appName, deployName, dstDeploymentName, pkgdata}
  }
}

function receivePromoteDeployment(appName, deployName, dstDeploymentName, pkgdata, data) {
  return {
    type: types.RECEIVE_PROMOTE_DEPLOYMENT,
    payload: {appName, deployName, dstDeploymentName, pkgdata, ...data }
  }
}

function receivePromoteDeploymentError(appName, deployName, dstDeploymentName, pkgdata, error) {
  return {
    type: types.RECEIVE_PROMOTE_DEPLOYMENT_ERROR,
    payload: { appName, deployName, dstDeploymentName, pkgdata, error }
  }
}

export function promoteDeployment(appName, deployName, dstDeploymentName, pkgdata) {
  return (dispatch) => {
    dispatch(requestPromoteDeployment(appName, deployName, dstDeploymentName, pkgdata));
    return restApi.promoteDeployment(appName, deployName, dstDeploymentName, pkgdata)
    .then(data => {
      checkResponseAuth(dispatch, data);
      if (_.get(data, 'status') == "OK") {
        dispatch(receivePromoteDeployment(appName, deployName, dstDeploymentName, pkgdata, data));
      } else {
        dispatch(receivePromoteDeploymentError(appName, deployName, dstDeploymentName, pkgdata, {message: _.get(data, 'message')}));
      }
    });
  };
}
