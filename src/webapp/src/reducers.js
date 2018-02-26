import { combineReducers } from 'redux';
import {
  REQUEST_MEMBERS,
  RECEIVE_MEMBERS,
  REQUEST_PUBLIC_DIARIES,
  RECEIVE_PUBLIC_DIARIES,
  REQUEST_USER,
  RECEIVE_USER,
  HANDLE_AUTH_ERR,
  UNAUTHENTICATE_USER
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

function account(
  state = {
    isAuthenticated: false,
    isFetching: false,
    error: '',
    data: {}
  },
  action
) {
  switch (action.type) {
    case REQUEST_USER:
      return Object.assign({}, state, {
        isFetching: action.isFetching
      });
    case HANDLE_AUTH_ERR:
      return Object.assign({}, state, {
        error: action.error
      });
    case RECEIVE_USER:
      return Object.assign({}, state, {
        error: '',
        isAuthenticated: true,
        data: action.account
      });
    case UNAUTHENTICATE_USER:
      return Object.assign({}, state, {
        error: '',
        isAuthenticated: false,
        data: {}
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  members,
  publicDiaries,
  account
});
export default rootReducer;
