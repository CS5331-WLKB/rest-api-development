import React, { Component } from 'react';
import ajax_get from '../utils/ajax_get';
import API_Endpoints from '../utils/API_Endpoints';
import { PageHeader, Panel } from 'react-bootstrap';
import Diaries from './Diaries.js';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { fetchItems } from '../actions';

class Home extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchItems('members'));
    dispatch(fetchItems('public-diaries'));
  }

  renderMembers() {
    const { isLoadingMembers, members } = this.props;
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

  render() {
    const { isLoadingPublicDiaries, publicDiaries } = this.props;

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
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { members: allMembers, publicDiaries: allPublicDiaries } = state;
  const { isFetching: isLoadingMembers, items: members } = allMembers || {
    isFetching: true,
    items: []
  };
  const {
    isFetching: isLoadingPublicDiaries,
    items: publicDiaries
  } = allPublicDiaries || {
    isFetching: true,
    items: []
  };
  return {
    isLoadingMembers,
    members,
    isLoadingPublicDiaries,
    publicDiaries
  };
}

export default connect(mapStateToProps)(Home);
