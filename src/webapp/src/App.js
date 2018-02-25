import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
              </li>
            </ul>

            <hr />

            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
