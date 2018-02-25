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
        isLoading: false
      });
      ajax_post(
        API_Endpoints.register_user,
        { fullname, age, username, password },
        data => {
          this.setState({
            isLoading: false
          });
          if (data.status) {
            this.setMessage('Account created successfully');
          } else {
            this.setError(data.error);
          }
        }
      );
    }
  }

  render() {
    const { error, message, isLoading } = this.state;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Sign Up</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSignup.bind(this)}>
            {error ? (
              <Alert bsStyle="danger">{error}</Alert>
            ) : message ? (
              <Alert bsStyle="success">{message}</Alert>
            ) : (
              ''
            )}
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
        </Panel.Body>
      </Panel>
    );
  }
}

export default Signup;