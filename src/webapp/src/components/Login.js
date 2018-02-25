import React, { Component } from 'react';
import ajax_post from '../utils/ajax_post';
import API_Endpoints from '../utils/API_Endpoints';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  handleLogin() {
    const { username, password } = this.state;
    ajax_post(API_Endpoints.authenticate_user, { username, password }, data => {
      if (data.status) {
        this.setState({ members: data.result });
      } else {
        this.setState({ error: 'Username or password incorrect' });
      }
    });
  }

  render() {
    const { username, password } = this.state;
    return (
      <section>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          onChange={e => this.handleChange(e.target.name, e.target.value)}
          value={username}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          onChange={e => this.handleChange(e.target.name, e.target.value)}
          value={password}
        />
        <button
          id="submit-login"
          name="submit-login"
          type="submit"
          value="Login"
          onClick={this.handleLogin.bind(this)}
        >
          Login
        </button>
      </section>
    );
  }
}

export default Login;
