import { combineReducers } from 'redux';
import {
  REQUEST_MEMBERS,
  RECEIVE_MEMBERS,
  REQUEST_PUBLIC_DIARIES,
  RECEIVE_PUBLIC_DIARIES,
  REQUEST_MY_DIARIES,
  RECEIVE_MY_DIARIES,
  REQUEST_USER,
  RECEIVE_USER,
  HANDLE_AUTH_ERR,
  UNAUTHENTICATE_USER,
  REMOVE_DIARY,
  SHOW_ALERT,
  DISMISS_ALERT
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

function removeDiary(state = [], action) {
  switch (action.type) {
    case REMOVE_DIARY:
      const { diary } = action;
      const index = state.indexOf(diary);
      return [...state.slice(0, index), ...state.slice(index + 1)];
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
        items: action.diaries
      });
    case REMOVE_DIARY:
      return Object.assign({}, state, {
        items: removeDiary(state.items, action)
      });
    default:
      return state;
  }
}

function myDiaries(
  state = {
    isFetching: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_MY_DIARIES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_MY_DIARIES:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.diaries
      });
    case REMOVE_DIARY:
      return Object.assign({}, state, {
        items: removeDiary(state.items, action)
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

function alerts(state = [], action) {
  const { alert } = action;

  switch (action.type) {
    case SHOW_ALERT:
      alert.id = state.length + 1;
      return [...state, alert];
    case DISMISS_ALERT:
      const index = state.indexOf(alert);
      return [...state.slice(0, index), ...state.slice(index + 1)];
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  members,
  publicDiaries,
  myDiaries,
  account,
  alerts
});
export default rootReducer;
