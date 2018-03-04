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

class Signup extends Component {
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

  handleSignup(e) {
    e.preventDefault();
    const fullname = (this.fullnameField.value || '').trim();
    const age = (this.ageField.value || '').trim();
    const username = (this.usernameField.value || '').trim();
    const password = (this.passwordField.value || '').trim();

    if (!fullname) {
      this.setError('Full Name is required');
    } else if (!age) {
      this.setError('Age is required');
    } else if (!username) {
      this.setError('Username is required');
    } else if (!password) {
      this.setError('Password is required');
    } else {
      this.setState({
        isLoading: true
      });
      ajax_post(API_Endpoints.register_user, {
        fullname,
        age,
        username,
        password
      })
        .then(() => {
          this.setMessage('Account created successfully');
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          this.setError(error);
          this.setState({
            isLoading: false
          });
        });
    }
  }

  renderForm() {
    const { isLoading } = this.state;
    return (
      <Form horizontal onSubmit={this.handleSignup.bind(this)}>
        <FormGroup controlId="formHorizontalFullname">
          <Col componentClass={ControlLabel} sm={2}>
            Full Name
          </Col>
          <Col sm={10}>
            <FormControl
              type="text"
              placeholder="Full Name"
              inputRef={ref => (this.fullnameField = ref)}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalAge">
          <Col componentClass={ControlLabel} sm={2}>
            Age
          </Col>
          <Col sm={10}>
            <FormControl
              type="number"
              placeholder="Age"
              inputRef={ref => (this.ageField = ref)}
            />
          </Col>
        </FormGroup>
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
              Sign Up
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }

  render() {
    const { error, message } = this.state;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Sign Up</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {error ? (
            <Alert bsStyle="danger">{error}</Alert>
          ) : message ? (
            <Alert bsStyle="success">{message}</Alert>
          ) : (
            ''
          )}
          {!message ? this.renderForm() : ''}
        </Panel.Body>
      </Panel>
    );
  }
}

export default Signup;
