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

class NewDiary extends Component {
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

  handleCreate(e) {
    e.preventDefault();
    const title = (this.titleField.value || '').trim();
    const text = (this.textField.value || '').trim();

    if (!title) {
      this.setError('Title is required');
    } else if (!text) {
      this.setError('Text is required');
    } else {
      this.setState({
        isLoading: true
      });
      ajax_post(
        API_Endpoints.create_diary,
        {
          title,
          text,
          public: false
        },
        true
      )
        .then(() => {
          this.setMessage('New Diary created successfully');
        })
        .catch(error => {
          this.setError(error);
        })
        .finally(() => {
          this.setState({
            isLoading: false
          });
        });
    }
  }

  renderForm() {
    const { isLoading } = this.state;
    return (
      <Form horizontal onSubmit={this.handleCreate.bind(this)}>
        <FormGroup controlId="formHorizontalTitle">
          <Col componentClass={ControlLabel} sm={2}>
            Title
          </Col>
          <Col sm={10}>
            <FormControl
              type="text"
              placeholder="Full Name"
              inputRef={ref => (this.titleField = ref)}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalText">
          <Col componentClass={ControlLabel} sm={2}>
            Text
          </Col>
          <Col sm={10}>
            <FormControl
              type="text"
              placeholder="Text"
              inputRef={ref => (this.textField = ref)}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <FontAwesome tag="i" name="spinner" spin /> : ''}
              Create
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
          <Panel.Title componentClass="h3">New Diary</Panel.Title>
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

export default NewDiary;
