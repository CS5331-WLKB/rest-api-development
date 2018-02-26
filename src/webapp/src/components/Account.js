import React, { Component } from 'react';
import {
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Panel
} from 'react-bootstrap';
import { connect } from 'react-redux';

class Account extends Component {
  render() {
    const { account } = this.props;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Account</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal>
            <FormGroup controlId="formHorizontalFullname">
              <Col componentClass={ControlLabel} sm={2}>
                Full Name
              </Col>
              <Col sm={10}>
                <FormControl.Static>{account.fullname}</FormControl.Static>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalAge">
              <Col componentClass={ControlLabel} sm={2}>
                Age
              </Col>
              <Col sm={10}>
                <FormControl.Static>{account.age}</FormControl.Static>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalUsername">
              <Col componentClass={ControlLabel} sm={2}>
                Username
              </Col>
              <Col sm={10}>
                <FormControl.Static>{account.username}</FormControl.Static>
              </Col>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  const { data: account } = state.account;
  return {
    account
  };
}

export default connect(mapStateToProps)(Account);
