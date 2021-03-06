import React, { Component } from 'react';
import { Panel, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { logout } from '../actions';

class Logout extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(logout());
  }

  render() {
    const { isLoading, isAuthenticated } = this.props;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Log Out</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {isLoading ? (
            'Loading...'
          ) : isAuthenticated ? (
            <Alert bsStyle="danger">
              Something went wrong. Please refresh your page.
            </Alert>
          ) : (
            <Alert bsStyle="success">You are logged out successfully.</Alert>
          )}
        </Panel.Body>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  const { account } = state;
  const { isFetching: isLoading, isAuthenticated } = account;
  return {
    isLoading,
    isAuthenticated
  };
}

export default connect(mapStateToProps)(Logout);
