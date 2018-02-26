import React, { Component } from 'react';
import ajax_post from '../utils/ajax_post';
import API_Endpoints from '../utils/API_Endpoints';
import {
  Alert,
  Form,
  FormGroup,
  FormControl,
  Button,
  Col,
  ControlLabel,
  Panel
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { login } from '../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      message: '',
      isLoading: false
    };
  }

  setError(error) {
    this.setState({ error });
  }

  setMessage(message) {
    this.setState({ message });
  }

  handleLogin(e) {
    e.preventDefault();
    const username = (this.usernameField.value || '').trim();
    const password = (this.passwordField.value || '').trim();

    this.props.login({ username, password });
    // TODO: clear password field if username or password is invalid
  }

  render() {
    const { error, message, isLoading } = this.props;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Log In</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {error ? (
            <Alert bsStyle="danger">{error}</Alert>
          ) : message ? (
            <Alert bsStyle="success">{message}</Alert>
          ) : (
            ''
          )}
          <Form horizontal onSubmit={this.handleLogin.bind(this)}>
            <FormGroup controlId="formHorizontalUsername">
              <Col componentClass={ControlLabel} sm={2}>
                Username
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  placeholder="Username"
                  inputRef={ref => (this.usernameField = ref)}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl
                  type="password"
                  placeholder="Password"
                  inputRef={ref => (this.passwordField = ref)}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <FontAwesome tag="i" name="spinner" spin /> : ''}
                  Log in
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  const { account } = state;
  const { isFetching: isLoading, error } = account;
  return {
    isLoading,
    error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: data => dispatch(login(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
