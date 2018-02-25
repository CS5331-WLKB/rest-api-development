import React, { Component } from 'react';
import ajax_post from '../utils/ajax_post';
import API_Endpoints from '../utils/API_Endpoints';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      age: '',
      username: '',
      password: '',
      passwordAgain: '',
      error: ''
    };
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  handleSignup() {
    const { fullname, age, username, password, passwordAgain } = this.state;
    if (!fullname.trim()) {
      this.setState({
        error: 'Full Name is required'
      });
      return;
    }
    if (!age || isNaN(age)) {
      this.setState({
        error: !age ? 'Age is required' : 'Age should be an number'
      });
      return;
    }
    if (!username.trim()) {
      this.setState({
        error: 'Username is required'
      });
      return;
    }
    if (!password.trim()) {
      this.setState({
        error: 'Password is required'
      });
      return;
    }
    if (password !== passwordAgain) {
      this.setState({
        password: '',
        passwordAgain: '',
        error: "Password confirmation doens't match"
      });
      return;
    }
    ajax_post(
      API_Endpoints.register_user,
      { fullname, age, username, password },
      data => {
        if (data.status) {
        } else {
          this.setState({ error: 'Username or password incorrect' });
        }
      }
    );
  }

  render() {
    const {
      fullname,
      age,
      username,
      password,
      passwordAgain,
      error
    } = this.state;
    return (
      <section>
        <input
          type="text"
          id="fullname"
          name="fullname"
          placeholder="Full Name"
          onChange={e => this.handleChange(e.target.name, e.target.value)}
          value={fullname}
        />
        <input
          type="number"
          id="age"
          name="age"
          placeholder="Age"
          onChange={e => this.handleChange(e.target.name, e.target.value)}
          value={age}
        />
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
        <input
          type="password"
          id="password-again"
          name="passwordAgain"
          placeholder="Password Confirmation"
          onChange={e => this.handleChange(e.target.name, e.target.value)}
          value={passwordAgain}
        />
        <button
          id="submit-signup"
          name="submit-signup"
          type="submit"
          value="Signup"
          onClick={this.handleSignup.bind(this)}
        >
          Sign up
        </button>
        {!!error ? <p>{error}</p> : ''}
      </section>
    );
  }
}

export default Signup;
