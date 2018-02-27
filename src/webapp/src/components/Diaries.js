import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {
  Button,
  ButtonToolbar,
  Col,
  ListGroup,
  ListGroupItem,
  Row
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { deleteDiary, togglePermission } from '../actions';

class Diaries extends Component {
  render() {
    const {
      isAuthenticated,
      isLoading,
      diaries,
      deleteDiary,
      toggleDiary
    } = this.props;
    if (isLoading) {
      return (
        <span>
          <FontAwesome tag="i" name="spinner" spin />Loading...
        </span>
      );
    } else if (diaries.length) {
      return (
        <ListGroup>
          {diaries.map(diary => {
            return (
              <ListGroupItem key={diary.id}>
                <Row className="show-grid">
                  <Col sm={8}>
                    <p>
                      <strong>{diary.title}</strong>
                    </p>
                    <p>{diary.text}</p>
                  </Col>
                  {isAuthenticated ? (
                    <Col sm={4}>
                      <ButtonToolbar className="pull-right">
                        <Button
                          bsSize="small"
                          bsStyle="danger"
                          onClick={() => deleteDiary(diary)}
                        >
                          Delete
                        </Button>
                        <Button
                          bsSize="small"
                          onClick={() => toggleDiary(diary)}
                        >
                          Set as {diary.public ? 'Private' : 'Public'}
                        </Button>
                      </ButtonToolbar>
                    </Col>
                  ) : (
                    ''
                  )}
                </Row>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      );
    } else {
      return <span>No data found</span>;
    }
  }
}

function mapStateToProps(state) {
  const { account } = state;
  const { isAuthenticated } = account;
  return {
    isAuthenticated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteDiary: diary => dispatch(deleteDiary(diary)),
    toggleDiary: diary => dispatch(togglePermission(diary))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Diaries);
