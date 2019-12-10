
import React, { PropTypes, Component } from 'react';
import {Breadcrumb, Table, Button, Modal } from 'react-bootstrap';
import _ from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Product.css';
import Link from '../Link';

const moment = require('moment');

class Product extends Component {
  static propTypes = {
    appName: PropTypes.string,
    items: PropTypes.array,
    promoteDeployment: PropTypes.func,
    handleShowModal: PropTypes.func,
    handleCloseModal: PropTypes.func,
    showModal: PropTypes.bool,
  };

  static defaultProps = {
    appName: '',
    items: [],
    showModal: false,
    currentDeployment: {},
    promoteDeployment: () => {},
    handleShowModal: () => {},
    handleCloseModal: () => {},
  };

  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
  }

  render() {
    const totalHashLen = 15;
    const self = this;
    const tipText = '暂无数据';
    const showPromoteDlg = self.props.showModal;
    const handleClose = self.props.handleCloseModal;
    const current = self.props.currentDeployment;
    const pkgdata = current.pkgdata;
    const shortHash = pkgdata &&pkgdata.packageHash&&pkgdata.packageHash.length>totalHashLen?
      pkgdata.packageHash.substring(0,totalHashLen/2)+"***"+pkgdata.packageHash.substring(pkgdata.packageHash.length-(totalHashLen-totalHashLen/2),pkgdata.packageHash.length)
      :(pkgdata && pkgdata.packageHash)
    return (
      <div className={s.root} >
        <div className={s.container}>
        
        <Modal show={showPromoteDlg && current} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>!!!Promote To <text style={{color: 'red'}}>Production Deployment</text> Confirm!!!</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign:'center' }} >
          <p style={{textAlign:'left'}}>
            Deployment 源 <text style={{color: 'red'}}>({current.deployName}</text>) 版本信息
          </p>
              {
                pkgdata?(
                <p >
                  {!pkgdata?"":`当前版本: ${pkgdata.label}`}
                  <br></br>
                  {!pkgdata?"":`描述: ${pkgdata.description}`}
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
          </Modal.Body>
          <Modal.Footer>
            <Button style={{color: 'red'}} variant="secondary" onClick={handleClose} >
              Confirm Promote
            </Button>
            <Button variant="primary" onClick={handleClose} >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

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
    const handleShow = this.props.handleShowModal;
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
            {!pkgdata?"":`描述: ${pkgdata.description}`}
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
            handleShow(appName, deployName, dstDeploymentName, pkgdata);
          }}
        >
          Promote
        </Button>
      ) 
      :
      (<td></td>)
    return (
      <tr key={index}>
        <td style={deployName === 'Production' ? { color: 'green' } : null} >
          <Link style={deployName === 'Production' ? { color: 'green' } : { color: 'grey' }} to={`/apps/${this.props.appName}/${deployName}`}>{deployName}</Link>
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
