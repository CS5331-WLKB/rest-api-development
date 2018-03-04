import { combineReducers } from 'redux';
import {
  REQUEST_MEMBERS,
  RECEIVE_MEMBERS,
  REQUEST_PUBLIC_DIARIES,
  REQUEST_MY_DIARIES,
  RECEIVE_DIARIES,
  REMOVE_DIARY,
  REQUEST_USER,
  RECEIVE_USER,
  UNAUTHENTICATE_USER,
  HANDLE_AUTH_ERR,
  SHOW_ALERT,
  DISMISS_ALERT,
  TOGGLE_PERMISSION
} from './actions';
import { unionBy } from 'lodash';

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
        isFetching: action.isFetching
      });
    case RECEIVE_MEMBERS:
      return Object.assign({}, state, {
        items: action.members
      });
    default:
      return state;
  }
}

function isLoadingPublicDiaries(state = true, action) {
  switch (action.type) {
    case REQUEST_PUBLIC_DIARIES:
      return action.isFetching;
    default:
      return state;
  }
}

function isLoadingMyDiaries(state = true, action) {
  switch (action.type) {
    case REQUEST_MY_DIARIES:
      return action.isFetching;
    default:
      return state;
  }
}

function diary(
  state = {
    title: '',
    text: '',
    public: true
  },
  action
) {
  switch (action.type) {
    case TOGGLE_PERMISSION:
      return Object.assign({}, state, {
        public: !state.public
      });
    default:
      return state;
  }
}

function allDiaries(state = [], action) {
  switch (action.type) {
    case RECEIVE_DIARIES:
      return unionBy(state, action.diaries, 'id');
    case TOGGLE_PERMISSION:
      return state.map(d => {
        return d.id === action.diary.id ? diary(action.diary, action) : d;
      });
    case REMOVE_DIARY:
      const index = state.indexOf(action.diary);
      return [...state.slice(0, index), ...state.slice(index + 1)];
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
  isLoadingPublicDiaries,
  isLoadingMyDiaries,
  allDiaries,
  account,
  alerts
});
export default rootReducer;
