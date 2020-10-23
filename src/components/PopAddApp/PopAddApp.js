
import React, { PropTypes, Component } from 'react';
import {
  Modal,
  Button,
  FormGroup,
  FormControl,
  HelpBlock,
  ControlLabel,
  Col,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import _ from 'lodash';

const popoverFocus = (
  <Popover id="popover-trigger-focus">
    Может содержать только буквы и цифры
  </Popover>
);
class PopAddApp extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    isOnSubmiting: PropTypes.bool,
    close: PropTypes.func,
    input: PropTypes.func,
    errorTip: PropTypes.string,
    showModal: PropTypes.bool,
    isShowNameError: PropTypes.bool,
    isShowOSError: PropTypes.bool,
    isShowPlatformError: PropTypes.bool,
    os: PropTypes.string,
    platform: PropTypes.string,
    appName: PropTypes.string,
  };

  static defaultProps = {
    onSubmit: (name)=>{},
    isOnSubmiting: false,
    close: ()=>{},
    input: ()=>{},
    errorTip: '',
    showModal: false,
    isShowNameError: false,
    isShowOSError: false,
    isShowPlatformError: false,
    os: '',
    platform: '',
    appName: '',
  };

  constructor() {
    super();
    this.close = this.close.bind(this);
    this.setName = this.setName.bind(this);
    this.validateName = this.validateName.bind(this);
    this.setSelect = this.setSelect.bind(this);
    this.setPlatformSelect = this.setPlatformSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  setPlatformSelect(event){
    let select = event.target.value;
    this.props.input({platform:select});
  }

  setSelect(event){
    let select = event.target.value;
    this.props.input({os:select});
  }

  setName(event){
    let name = event.target.value;
    this.props.input({appName:name});
  }

  validateName(name) {
    const REGEX = /^\w+$/;
    if (REGEX.test(name)) {
      this.setState({isShowNameError:false});
    } else {
      this.setState({isShowNameError:true});
    }
  }

  onSubmit(){
    if (this.props.isOnSubmiting) {
      return;
    }
    this.props.onSubmit();
  }

  close() {
    this.props.close();
  }

  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить приложение</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup validationState={this.props.isShowNameError ? `error` : null}>
            <ControlLabel>Имя приложения</ControlLabel>
            <OverlayTrigger trigger={["hover"]} placement="bottom" overlay={popoverFocus}>
            <FormControl
              type="text"
              onChange={this.setName}
              value={this.props.appName}
              autoFocus
            />
            </OverlayTrigger>
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup validationState={this.props.isShowOSError ? `error` : null}>
            <ControlLabel>Платформа</ControlLabel>
            <FormControl
              componentClass="select"
              value={this.props.os}
              onChange={this.setSelect}
            >
              <option value="" >Выберите платформу</option>
              <option value="iOS" >iOS</option>
              <option value="Android" >Android</option>
              <option value="Windows" >Windows</option>
            </FormControl>
          </FormGroup>
          <FormGroup validationState={this.props.isShowPlatformError ? `error` : null}>
            <ControlLabel>Типы</ControlLabel>
            <FormControl
              componentClass="select"
              value={this.props.platform}
              onChange={this.setPlatformSelect}
            >
              <option value="" >Выберите тип</option>
              <option value="React-Native" >React-Native</option>
              <option value="Cordova" >Cordova</option>
            </FormControl>
          </FormGroup>
          <FormGroup validationState="error">
            <HelpBlock>{this.props.errorTip}</HelpBlock>
          </FormGroup>
        </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Отмена</Button>
            <Button onClick={this.onSubmit} disabled={this.props.isOnSubmiting ? true : false} >Добавить</Button>
          </Modal.Footer>
      </Modal>
    )
  }
}
export default PopAddApp;
