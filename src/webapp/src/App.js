import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { Navbar, Nav, NavItem, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Router>
          <div>
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">Home</Link>
                </Navbar.Brand>
              </Navbar.Header>
              <Nav pullRight>
                <LinkContainer to="/login">
                  <NavItem eventKey={1}>Log In</NavItem>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <NavItem eventKey={2}>Sign Up</NavItem>
                </LinkContainer>
              </Nav>
            </Navbar>

            <Grid>
              <Row className="show-grid">
                <Col xs={12} md={12}>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/signup" component={Signup} />
                </Col>
              </Row>
            </Grid>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
