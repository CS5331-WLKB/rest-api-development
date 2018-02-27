import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Home, Login, Signup, Account, NewDiary, Logout } from './components';
import { Navbar, Nav, NavItem, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { checkIsAuthenticated, logout, dismissAlert } from './actions';
import { Alert, AlertContainer } from 'react-bs-notifier';

class App extends Component {
  componentWillMount() {
    const { checkAuthentication } = this.props;
    checkAuthentication();
  }

  renderPublicLinks() {
    return (
      <Nav pullRight>
        <LinkContainer to="/login">
          <NavItem eventKey={1}>Log In</NavItem>
        </LinkContainer>
        <LinkContainer to="/signup">
          <NavItem eventKey={2}>Sign Up</NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  handleLogout() {
    this.props.logou();
  }

  renderPrivateLinks() {
    const { account } = this.props;
    return (
      <Nav pullRight>
        <LinkContainer to="/account">
          <NavItem eventKey={1}>Welcome, {account.fullname}</NavItem>
        </LinkContainer>
        <LinkContainer to="/new-diary">
          <NavItem eventKey={2}>New Diary</NavItem>
        </LinkContainer>
        <LinkContainer to="/logout">
          <NavItem eventKey={3}>Log Out</NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  render() {
    const { isAuthenticated, alerts, dismissAlert } = this.props;
    return (
      <div className="app-container">
        <AlertContainer>
          {alerts.map(alert => {
            return (
              <Alert
                type={alert.type}
                key={alert.id}
                timeout={1000}
                onDismiss={() => dismissAlert(alert)}
              >
                {alert.message}
              </Alert>
            );
          })}
        </AlertContainer>
        <Router>
          <div>
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">Home</Link>
                </Navbar.Brand>
              </Navbar.Header>
              {isAuthenticated
                ? this.renderPrivateLinks()
                : this.renderPublicLinks()}
            </Navbar>

            <Grid>
              <Row className="show-grid">
                <Col xs={12} md={12}>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/signup" component={Signup} />
                  <Route exact path="/account" component={Account} />
                  <Route exact path="/logout" component={Logout} />
                  <Route exact path="/new-diary" component={NewDiary} />
                </Col>
              </Row>
            </Grid>
          </div>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { account, alerts } = state;
  const { isAuthenticated, data } = account;
  return {
    isAuthenticated,
    account: data,
    alerts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
    checkAuthentication: () => dispatch(checkIsAuthenticated()),
    dismissAlert: alert => dispatch(dismissAlert(alert))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
