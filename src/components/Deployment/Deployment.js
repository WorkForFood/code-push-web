
import React, { PropTypes, Component } from 'react';
import {Breadcrumb, Table} from 'react-bootstrap';
import cx from 'classnames';
import _ from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Deployment.css';
import Link from '../Link';
import moment from 'moment'

class Deployment extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    history: PropTypes.array,
    appName: PropTypes.string,
    deploymentName: PropTypes.string, 
  };

  static defaultProps = {
    isFetching: true,
    appName: '',
    deploymentName: '',
    history: [],
  };

  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
  }


  renderRow(rowData, index) {

    const totalHashLen = 15;
    const pkgdata= rowData

    const shortHash = pkgdata&&pkgdata.packageHash&&pkgdata.packageHash.length>totalHashLen?
      pkgdata.packageHash.substring(0,totalHashLen/2)+"***"+pkgdata.packageHash.substring(pkgdata.packageHash.length-(totalHashLen-totalHashLen/2),pkgdata.packageHash.length)
      :(pkgdata && pkgdata.packageHash)

    return (
      <tr>
        <td style={{ textAlign:'center' }}>{pkgdata.appVersion}</td>
        <td style={{ textAlign:'center' }}>{pkgdata.description}</td>
        <td style={{ textAlign:'center' }}>
         {pkgdata?(
          <p>
            {`当前版本: ${pkgdata.label}`}
            <br></br>
            {`发布者: ${pkgdata.releasedBy}`}
            <br></br>
            {`状态: ${pkgdata.isDisabled?"停用":"可用"}`}
            <br></br>
            {`强制升级: ${pkgdata.isMandatory?"是":"否"}`}
            <br></br>
            {`上传时间: ${moment(pkgdata.uploadTime).format('YYYY-MM-DD HH:mm:ss')}`}
            <br></br>
            {`packageHash: ${shortHash}`}
          </p>
          )
          :null
         }
        </td>
        <td></td>
        <td></td>
        {/* <td>{JSON.stringify(pkgdata)}</td> */}
      </tr>
    )
  }

  render() {
    const self = this;
    // const tipText = '暂无数据';
    const packages = this.props.history;
    const tipText = JSON.stringify(packages&&packages.length>0?packages[0]:{})
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
              <th style={{ textAlign:'center' }} >Desc</th>
              <th style={{ textAlign:'center' }} >PackageInfo</th>
              <th style={{ textAlign:'center' }} >Install Metrics</th>
              <th style={{ textAlign:'center' }} >操作</th>
            </tr>
          </thead>
          <tbody>
              {
            packages&&packages.length>0?_.map(packages, (pkgdata, index) => self.renderRow(pkgdata, index))

            :(<tr>
               <td colSpan="4" >{tipText}</td>
             </tr>)
            }
          </tbody>
        </Table>
        </div>
      </div>
    );
  }
}
export default withStyles(s)(Deployment);
