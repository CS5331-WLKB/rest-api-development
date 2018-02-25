import React, { Component } from 'react';
import ajax_get from '../utils/ajax_get';
import API_Endpoints from '../utils/API_Endpoints';
import { PageHeader, Panel } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { members: [] };
  }

  componentDidMount() {
    this.getMembers();
  }

  getMembers() {
    ajax_get(API_Endpoints.get_members, data => {
      if (data.status) {
        this.setState({ members: data.result });
      }
    });
  }

  render() {
    const members = this.state.members.map(name => (
      <ul key={name}>
        <li>{name}</li>
      </ul>
    ));
    return (
      <div>
        <PageHeader>Welcome to CS5331 - Group WLKB</PageHeader>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Team Members</Panel.Title>
          </Panel.Heading>
          <Panel.Body>{members}</Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default Home;
