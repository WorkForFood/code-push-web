
import React, { PropTypes, Component } from 'react';
import {Breadcrumb, Table} from 'react-bootstrap';
import cx from 'classnames';
import _ from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Deployment.css';
import Link from '../Link';

class Deployment extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    rs: PropTypes.array,
    appName: PropTypes.string,
    deploymentName: PropTypes.string,
    deployment: PropTypes.object
  };

  static defaultProps = {
    isFetching: true,
    appName: '',
    deploymentName: '',
    deployment: {},
  };

  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
  }


  renderRow(rowData, index) {

    return (<tr></tr>)
    const pkgdata= rowData
    return (
      <tr>
      <td>{pkgdata.appVersion?pkgdata.appVersion:""}</td>
        <td>{pkgdata.appVersion}</td>
        <td>{pkgdata.appVersion}</td>
        <td>{pkgdata.appVersion}</td>
        {/* <td>{JSON.stringify(pkgdata)}</td> */}
      </tr>
    )
  }

  render() {
    const self = this;
    const tipText = '暂无数据';
    // const tipText = JSON.stringify(this.props)
    const packages = this.props.deployment.package;
    //const tipText = JSON.stringify(packages)
    return (
      <div className={s.root} >
        <div className={s.container}>
        <Breadcrumb>
          <Breadcrumb.Item active={true}>
            <Link to="/apps">应用列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            <Link to={`/apps/${this.props.appName}`}>{this.props.appName}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {this.props.deploymentName}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th style={{ textAlign:'center' }} >AppVersion</th>
              <th style={{ textAlign:'center' }} >PackageInfo</th>
              <th style={{ textAlign:'center' }} >Install Metrics</th>
              <th style={{ textAlign:'center' }} >操作</th>
            </tr>
          </thead>
          <tbody>
              {
             _.map(packages, (pkgdata, index) => self.renderRow(pkgdata, index))

            }
            <tr>
               <td colSpan="4" >{tipText}</td>
             </tr>
          </tbody>
        </Table>
        </div>
      </div>
    );
  }
}
export default withStyles(s)(Deployment);
