/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import fetch from '../../core/fetch';
import LayoutContainer from '../../containers/LayoutContainer';
import { getProducts, fetchDeployments, fetchDeploymentHistory} from '../../actions/productsActions';
import restApi from '../../network/RestApi';

export default {

  path: '/',

  async action({ store }) {
    if (process.env.BROWSER) {
      setTimeout(() => {
        store.dispatch(getProducts());
      }, 100);
    }
    const ProductListContainer = await require.ensure([], require => require('../../containers/ProductListContainer').default, 'apps');
    return {
      title: 'Сервер удаленных обновлений',
      chunk: 'home',
      component: <LayoutContainer><ProductListContainer /></LayoutContainer>,
    };
  },

  /*
  async action() {
    const resp = await fetch(restApi.buildReadmeUrl(), {
      method: 'get',
      timeout: 5000,
      headers: {
        Accept: 'text/html',
        'Content-Type': 'text/html',
      },
    });
    if (resp.status !== 200) throw new Error(`error when get ${restApi.buildReadmeUrl()}, erro: ${resp.statusText}`);
    const data = await resp.text();
    const HomeContainer = await require.ensure([], require => require('../../containers/HomeContainer').default, 'home');
    return {
      title: 'Сервер удаленных обновлений',
      chunk: 'home',
      component: <LayoutContainer><HomeContainer html={data} /></LayoutContainer>,
    };
  },
  */

};
