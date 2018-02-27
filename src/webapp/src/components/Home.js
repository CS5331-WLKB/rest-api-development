import React, { Component } from 'react';
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
    if (this.props.isAuthenticated) {
      dispatch(fetchItems('my-diaries'));
    }
  }

  renderMembers() {
    const { isLoadingMembers, members } = this.props;
    if (isLoadingMembers) {
      return (
        <span>
          <FontAwesome tag="i" name="spinner" spin />Loading...
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
    const {
      isAuthenticated,
      isLoadingPublicDiaries,
      publicDiaries,
      isLoadingMyDiaries,
      myDiaries
    } = this.props;

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
        {isAuthenticated ? (
          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h3">My Diaries</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Diaries isLoading={isLoadingMyDiaries} diaries={myDiaries} />
            </Panel.Body>
          </Panel>
        ) : (
          ''
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    members: allMembers,
    publicDiaries: allPublicDiaries,
    myDiaries: allMyDiaries,
    account
  } = state;
  const { isFetching: isLoadingMembers, items: members } = allMembers;
  const {
    isFetching: isLoadingPublicDiaries,
    items: publicDiaries
  } = allPublicDiaries;
  const { isFetching: isLoadingMyDiaries, items: myDiaries } = allMyDiaries;
  const { isAuthenticated } = account;
  return {
    isAuthenticated,
    isLoadingMembers,
    members,
    isLoadingPublicDiaries,
    publicDiaries,
    isLoadingMyDiaries,
    myDiaries
  };
}

export default connect(mapStateToProps)(Home);
