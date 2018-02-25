import React, { Component } from 'react';
import ajax_get from '../utils/ajax_get';
import API_Endpoints from '../utils/API_Endpoints';
import { PageHeader, Panel } from 'react-bootstrap';
import Diaries from './Diaries.js';
import FontAwesome from 'react-fontawesome';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingMembers: true,
      members: [],
      isLoadingPublicDiaries: true,
      publicDiaries: []
    };
  }

  componentDidMount() {
    this.getMembers();
    this.getPublicDiaries();
  }

  getMembers() {
    this.setState({
      isLoadingMembers: true
    });
    ajax_get(API_Endpoints.get_members, data => {
      this.setState({
        isLoadingMembers: false
      });
      if (data.status) {
        this.setState({ members: data.result });
      }
    });
  }

  renderMembers() {
    const { isLoadingMembers, members } = this.state;
    if (isLoadingMembers) {
      return (
        <span>
          <FontAwesome tag="i" name="spinner" spin /> Loading...
        </span>
      );
    } else {
      return (
        <ul>
          {members.map(name => {
            return <li key={name}>{name}</li>;
          })}
        </ul>
      );
    }
  }

  getPublicDiaries() {
    this.setState({
      isLoadingPublicDiaries: true
    });
    ajax_get(API_Endpoints.get_public_diaries, data => {
      this.setState({
        isLoadingPublicDiaries: false
      });
      if (data.status) {
        this.setState({ publicDiaries: data.result });
      }
    });
  }

  render() {
    const { isLoadingPublicDiaries, publicDiaries } = this.state;

    return (
      <div>
        <PageHeader>Welcome to CS5331 - Group WLKB</PageHeader>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Team Members</Panel.Title>
          </Panel.Heading>
          <Panel.Body>{this.renderMembers()}</Panel.Body>
        </Panel>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Public Diaries</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Diaries
              isLoading={isLoadingPublicDiaries}
              diaries={publicDiaries}
            />
          </Panel.Body>
        </Panel>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">My Diaries</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Diaries
              isLoading={isLoadingPublicDiaries}
              diaries={publicDiaries}
            />
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default Home;
