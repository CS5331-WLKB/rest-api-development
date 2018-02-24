import React, { Component } from 'react';
import ajax_get, { API_ENDPOINT } from '../utils/ajax_get';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { members: [] };
  }

  componentDidMount() {
    this.getMembers();
  }

  getMembers() {
    ajax_get(`${API_ENDPOINT}/meta/members`, data => {
      if (data.status) {
        this.setState({ members: data.result });
      }
    });
  }

  render() {
    const members = this.state.members.map(name => (
      <div key={name}>
        <h1>{name}</h1>
      </div>
    ));
    return (
      <div>
        <header className="App-header">
          <h1 className="App-title">Welcome to CS5331 - Group WLKB </h1>
        </header>
        <div className="App-intro">Team Members: {members}</div>
      </div>
    );
  }
}

export default Home;
