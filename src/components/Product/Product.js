
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
    const tipText = 'Нет данных';
    const showPromoteDlg = self.props.showModal;
    const handleClose = self.props.handleCloseModal;
    const promoteDeployment = self.props.promoteDeployment;
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
            Источник развертывания <text style={{color: 'red'}}>({current.deployName}</text>) Информация о версии
          </p>
              {
                pkgdata?(
                <p >
                  {!pkgdata?"":`текущая версия: ${pkgdata.label}`}
                  <br></br>
                  {!pkgdata?"":`описание: ${pkgdata.description}`}
                  <br></br>
                  {!pkgdata?"":`Автор: ${pkgdata.releasedBy}`}
                  <br></br>
                  {!pkgdata?"":`Активно: ${pkgdata.isDisabled?"Нет":"Да"}`}
                  <br></br>
                  {!pkgdata?"":`Обязательно: ${pkgdata.isMandatory?"Да":"Нет"}`}
                  <br></br>
                  {!pkgdata?"":`Время: ${moment(pkgdata.uploadTime).format('YYYY-MM-DD HH:mm:ss')}`}
                  <br></br>
                  {!pkgdata?"":`Hash пакета: ${shortHash}`}
                </p>
                )
                :null
              }
          </Modal.Body>
          <Modal.Footer>
            <Button style={{color: 'red'}} variant="secondary" onClick={()=>{promoteDeployment(current.appName, current.deployName, current.dstDeploymentName, current.pkgdata)}} >
              Confirm Promote
            </Button>
            <Button variant="primary" onClick={handleClose} >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Breadcrumb>
          <Breadcrumb.Item active={true}>
            <Link to="/apps">Список приложений</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active={true}>
            {this.props.appName}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th style={{ textAlign:'center' }} >Обновление</th>
              <th style={{ textAlign:'center' }} >Ключ обновления</th>
              <th style={{ textAlign:'center' }} >Описание</th>
              <th style={{ textAlign:'center' }} >Metadata</th>
              <th style={{ textAlign:'center' }} >Активно</th>
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
            {!pkgdata?"":`текущая версия: ${pkgdata.label}`}
            <br></br>
            {!pkgdata?"":`описание: ${pkgdata.description}`}
            <br></br>
            {!pkgdata?"":`Автор: ${pkgdata.releasedBy}`}
            <br></br>
            {!pkgdata?"":`Активно: ${pkgdata.isDisabled?"Нет":"Да"}`}
            <br></br>
            {!pkgdata?"":`Обязательно: ${pkgdata.isMandatory?"Да":"Нет"}`}
            <br></br>
            {!pkgdata?"":`Время: ${moment(pkgdata.uploadTime).format('YYYY-MM-DD HH:mm:ss')}`}
            <br></br>
            {!pkgdata?"":`Hash пакета: ${shortHash}`}
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
