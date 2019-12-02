
import React, { PropTypes, Component } from 'react';
import {Breadcrumb, Table, Button} from 'react-bootstrap';
import cx from 'classnames';
import _ from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Product.css';
import Link from '../Link';
const moment = require('moment')

class Product extends Component {
  static propTypes = {
    appName: PropTypes.string,
    items: PropTypes.array,
    promoteDeployment: PropTypes.func,
  };

  static defaultProps = {
    appName: '',
    items: [],
    promoteDeployment: (appName, deployment)=>{},
  };

  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
  }

  render() {
    const self = this;
    const tipText = '暂无数据';
    return (
      <div className={s.root} >
        <div className={s.container}>
        <Breadcrumb>
          <Breadcrumb.Item active={true}>
            <Link to="/apps">应用列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {this.props.appName}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th style={{ textAlign:'center' }} >Deployments</th>
              {/* <th style={{ textAlign:'center' }} >DeploymentKey</th> */}
              {/* <th style={{ textAlign:'center' }} >Description</th> */}
              <th style={{ textAlign:'center' }} >Update Metadata</th>
              <th style={{ textAlign:'center' }} >操作</th>
            </tr>
          </thead>
          <tbody>
            {
             this.props.items.length > 0 ?
             _.map(this.props.items, (item, index) => self.renderRow(item, index))
             :
             <tr>
               <td colSpan="6" >{tipText}</td>
             </tr>
            }
          </tbody>
        </Table>
        </div>
      </div>
    );
  }

  renderRow(rowData, index) {
    const totalHashLen = 15;
    const appName = this.props.appName;
    const deployName = _.get(rowData, 'name');
    const pkgdata = _.get(rowData, 'package');
    const dstDeploymentName = "Production";
    const shortHash = pkgdata &&pkgdata.packageHash&&pkgdata.packageHash.length>totalHashLen?
      pkgdata.packageHash.substring(0,totalHashLen/2)+"***"+pkgdata.packageHash.substring(pkgdata.packageHash.length-(totalHashLen-totalHashLen/2),pkgdata.packageHash.length)
      :(pkgdata && pkgdata.packageHash)
    var disabled = true;
    if (!this.props.isFetching){
        disabled = false;
    }
    const updateMeta =(
      <td>
        {`DeploymentKey:${_.get(rowData, 'key')}`}
        {
          pkgdata?(
          <p>
            {!pkgdata?"":`当前版本: ${pkgdata.label}`}
            <br></br>
            {!pkgdata?"":`发布者: ${pkgdata.releasedBy}`}
            <br></br>
            {!pkgdata?"":`状态: ${pkgdata.isDisabled?"停用":"可用"}`}
            <br></br>
            {!pkgdata?"":`强制升级: ${pkgdata.isMandatory?"是":"否"}`}
            <br></br>
            {!pkgdata?"":`上传时间: ${moment(pkgdata.uploadTime).format('YYYY-MM-DD HH:mm:ss')}`}
            <br></br>
            {!pkgdata?"":`packageHash: ${shortHash}`}
          </p>
          )
          :null
        }
      </td>
    )
    const operation = pkgdata && deployName != "Production" ? (
        <Button
          disabled={disabled}
          onClick={()=>{
            if (disabled) {
              return;
            }
            this.props.promoteDeployment(appName, deployName, dstDeploymentName, pkgdata);
          }}
        >
          Promote
        </Button>
      ) 
      :
      (<td></td>)
    return (
      <tr key={index}>
        <td>
          <Link to={`/apps/${this.props.appName}/${deployName}`}>{deployName}</Link>
        </td>
        {/* <td style={{ textAlign: 'left' }}>
          {_.get(rowData, 'key')}
        </td> */}
        {/* <td>{desc}</td> */}
        {updateMeta}
        {operation}
      </tr>
    );
  }

}

export default withStyles(s)(Product);
