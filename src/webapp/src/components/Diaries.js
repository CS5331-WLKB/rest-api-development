import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Diary from './Diary';

class Diaries extends Component {
  render() {
    const { isLoading, diaries } = this.props;
    if (isLoading) {
      return (
        <span>
          <FontAwesome tag="i" name="spinner" spin />Loading...
        </span>
      );
    } else if (diaries.length) {
      return (
        <ul>
          {diaries.map(diary => {
            return (
              <li key={diary.id}>
                <Diary diary={diary} />
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <span>No data found</span>;
    }
  }
}

export default Diaries;
