
import React, { PropTypes, Component } from 'react';
import {Modal, Button, FormGroup, FormControl, HelpBlock} from 'react-bootstrap';

class PopShowKey extends Component {
  static propTypes = {
    value: PropTypes.string,
    close: PropTypes.func,
    showModal: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    showModal: false,
    close: ()=>{},
  };

  constructor() {
    super();
    this.close = this.close.bind(this);
  }

  close() {
    this.props.close();
  }

  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Создать ключ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup validationState="success">
            <FormControl
              value={this.props.value}
              onFocus={(event)=>{
                event.target.select();
              }}
              onClick={(event)=>{
                event.target.select();
              }}
              onMouseOver={(event)=>{
                event.target.select();
              }}
              readOnly
              type="text"
            />
            <HelpBlock>Скопируйте ключ затем закройте всплывающее окно</HelpBlock>
          </FormGroup>
        </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Закрыть</Button>
          </Modal.Footer>
      </Modal>
    )
  }
}
export default PopShowKey;
