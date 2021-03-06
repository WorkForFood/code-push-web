
import React, { PropTypes, Component } from 'react';
import { Breadcrumb, Table, Button, Col } from 'react-bootstrap';
import cx from 'classnames';
import _ from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProductList.css';
import Link from '../Link';

class ProductList extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    rs: PropTypes.array,
    popAddApp: PropTypes.func,
  };

  static defaultProps = {
    isFetching: true,
    rs: [],
    popAddApp: () => {},
  };

  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
  }
  renderRow(rowData, index) {
    const appName = _.get(rowData, 'name');
    const os = _.get(rowData, 'os');
    const platform = _.get(rowData, 'platform');
    return (
      <tr key={_.get(rowData, 'name')}>
        <td>
          <Link to={`/apps/${appName}`}>{appName}</Link>
        </td>
        <td style={{ textAlign: 'center' }}>
          {os}
        </td>
        <td style={{ textAlign: 'center' }}>
          {platform}
        </td>
        <td style={{ textAlign: 'center' }}>
          <ul style={{padding: '0px'}}>
            {
            _.map(_.get(rowData, 'collaborators'), (item, email) => (
              <li key={email}>
                {email}
                <span className={s.permission}>
                    (<em>{_.get(item, 'permission') == "Owner" ? "Владелец" : "Пользователь"}</em>)
                  </span>
                {
                    _.get(item, 'isCurrentAccount') ?
                      <span className={cx(s.label, s.labelSuccess)}>
                      Вы
                    </span>
                    : null
                  }
              </li>
              ))
          }
          </ul>
        </td>
        <td>
          <ul style={{padding: '0px'}}>
            {
            _.map(_.get(rowData, 'deployments'), (item, email) => (
              <li key={email} style={item === 'Production' ? { color: 'green' } : null} >
                <Link to={`/apps/${appName}/${item}`}>{item}</Link>
              </li>
              ))
          }
          </ul>
        </td>
      </tr>
    );
  }

  render() {
    const self = this;
    const tipText = 'Нет данных';
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Breadcrumb>
            <Breadcrumb.Item active>
            Список приложений
          </Breadcrumb.Item>
          </Breadcrumb>
          <Col style={{ marginBottom: '20px' }}>
            <Button
              onClick={this.props.popAddApp}
              bsStyle="primary"
            >
          Добавить приложение
          </Button>
          </Col>
          <Table striped bordered condensed hover responsive>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} >Наименование</th>
                <th style={{ textAlign: 'center' }} >Система</th>
                <th style={{ textAlign: 'center' }} >Платформа</th>
                <th style={{ textAlign: 'center' }} >Пользователь</th>
                <th style={{ textAlign: 'center' }} >Деплой</th>
              </tr>
            </thead>
            <tbody>
              {
             this.props.rs.length > 0 ?
             _.map(this.props.rs, (item, index) => self.renderRow(item, index))
             :
             <tr>
               <td colSpan="4" >{tipText}</td>
             </tr>
            }
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
export default withStyles(s)(ProductList);
