import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import './Diaries.css';
import {
  Button,
  ButtonToolbar,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Label,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { deleteDiary, togglePermission } from '../actions';

class Diaries extends Component {
  renderTooltip(isPublic) {
    return (
      <Tooltip placement="bottom" className="in" id="tooltip-bottom">
        {isPublic ? 'Public' : 'Private'}
      </Tooltip>
    );
  }

  render() {
    const {
      isLoading,
      diaries,
      deleteDiary,
      toggleDiary,
      currentAccount
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
              <ListGroupItem key={diary.id} className="diary-snippet">
                <Row className="show-grid">
                  <Col sm={8}>
                    <p>
                      <strong>{diary.title}</strong>
                      <OverlayTrigger
                        placement="top"
                        overlay={this.renderTooltip(diary.public)}
                      >
                        {diary.public ? (
                          <Label bsStyle="warning">
                            <FontAwesome name="unlock">Public</FontAwesome>
                          </Label>
                        ) : (
                          <Label bsStyle="success">
                            <FontAwesome name="lock">Private</FontAwesome>
                          </Label>
                        )}
                      </OverlayTrigger>

                      <small>
                        published by {diary.author} on {diary.publish_date}
                      </small>
                    </p>
                    <p>{diary.text}</p>
                  </Col>
                  {diary.author === currentAccount.username ? (
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
  const { data: currentAccount } = account;
  return {
    currentAccount
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteDiary: diary => dispatch(deleteDiary(diary)),
    toggleDiary: diary => dispatch(togglePermission(diary))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Diaries);
