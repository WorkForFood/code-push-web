
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

    if (!pkgdata) {
      return ( null )
    }

    const shortHash = pkgdata.packageHash&&pkgdata.packageHash.length>totalHashLen?
      pkgdata.packageHash.substring(0,totalHashLen/2)+"***"+pkgdata.packageHash.substring(pkgdata.packageHash.length-(totalHashLen-totalHashLen/2),pkgdata.packageHash.length)
      :(pkgdata && pkgdata.packageHash)

    return (
      <tr>
        <td style={{ textAlign:'center' }}>{pkgdata.appVersion}</td>
        <td style={{ textAlign:'center' }}>{pkgdata.description}</td>
          <td style={{ textAlign:'center' }}>
            <tr>
              <td style={{ textAlign:'center' }} >Текущая версия</td>
              <td style={{ textAlign:'right' }} >{pkgdata.label}</td>
            </tr>
            <tr>
              <td style={{ textAlign:'center' }}  >Автор</td>
              <td style={{ textAlign:'right' }} >{pkgdata.releasedBy}</td>
            </tr>
            <tr>
              <td style={{ textAlign:'center' }}  >Активен</td>
              <td style={{ textAlign:'right' }} >{pkgdata.isDisabled?"停用":"可用"}</td>
              <td>操作</td>
            </tr>
            <tr>
              <td style={{ textAlign:'center' }}  >Обязательный</td>
              <td style={{ textAlign:'right' }} >{pkgdata.isMandatory?"是":"否"}</td>
              <td>操作</td>
            </tr>
            <tr>
              <td style={{ textAlign:'center' }}  >Загружено</td>
              <td style={{ textAlign:'right' }} >{moment(pkgdata.uploadTime).format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
            <tr>
              <td style={{ textAlign:'center' }} >Hash пакета</td>
              <td style={{ textAlign:'right' }} >{shortHash}</td>
            </tr>
          </td>
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
            <Link to="/apps">Список приложений</Link>
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
              <th style={{ textAlign:'center' }} >Версия</th>
              <th style={{ textAlign:'center' }} >Описание</th>
              <th style={{ textAlign:'center' }} >Информация о пакете</th>
              <th style={{ textAlign:'center' }} >Метрика</th>
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
