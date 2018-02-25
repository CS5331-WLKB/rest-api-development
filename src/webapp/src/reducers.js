import { combineReducers } from 'redux';
import {
  REQUEST_MEMBERS,
  RECEIVE_MEMBERS,
  REQUEST_PUBLIC_DIARIES,
  RECEIVE_PUBLIC_DIARIES
} from './actions';

function members(
  state = {
    isFetching: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_MEMBERS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_MEMBERS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.members
      });
    default:
      return state;
  }
}

function publicDiaries(
  state = {
    isFetching: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_PUBLIC_DIARIES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_PUBLIC_DIARIES:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.publicDiaries
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  members,
  publicDiaries
});
export default rootReducer;
