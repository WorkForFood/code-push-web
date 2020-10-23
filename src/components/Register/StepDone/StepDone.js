import React from 'react';
import {
  ControlLabel,
  Form,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import Link from '../../Link';


function StepDone() {
  return (
    <Form style={{  maxWidth:350, marginLeft:"auto", marginRight: "auto" }}>
      <FormGroup style={{ textAlign:'center' }}>
        <div>
          <span>Поздравляю! Вы успешно зарегистрировались!</span>
          <Link to="/login">Авторизоаться</Link>
        </div>
      </FormGroup>
    </Form>
  );
}
export default StepDone;
