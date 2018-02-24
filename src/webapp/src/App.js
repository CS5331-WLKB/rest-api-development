import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const API_ENDPOINT = 'http://localhost:8080';

const ajax_get = function(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + ' in ' + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open('GET', url, true);
  xmlhttp.send();
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { members: [] };
  }

  componentDidMount() {
    //For our first load.
    this.MemberList(); //maybe something like "groupOne"
  }

  MemberList() {
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to CS5331 - Group WLKB </h1>
        </header>
        <div className="App-intro">Team Members: {members}</div>
      </div>
    );
  }
}

export default App;
