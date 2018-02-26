import ajax_get from './utils/ajax_get';
import ajax_post from './utils/ajax_post';
import API_Endpoints from './utils/API_Endpoints';

export const REQUEST_MEMBERS = 'REQUEST_MEMBERS';
export const RECEIVE_MEMBERS = 'RECEIVE_MEMBERS';
export const REQUEST_PUBLIC_DIARIES = 'REQUEST_PUBLIC_DIARIES';
export const RECEIVE_PUBLIC_DIARIES = 'RECEIVE_PUBLIC_DIARIES';
export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const HANDLE_AUTH_ERR = 'HANDLE_AUTH_ERR';

function requestMembers() {
  return {
    type: REQUEST_MEMBERS
  };
}

function receiveMembers(items) {
  return {
    type: RECEIVE_MEMBERS,
    members: items
  };
}

function requestPublicDiaires() {
  return {
    type: REQUEST_PUBLIC_DIARIES
  };
}

function receivePublicDiaries(items) {
  return {
    type: RECEIVE_PUBLIC_DIARIES,
    publicDiaries: items
  };
}

function requestItems(type) {
  switch (type) {
    case 'members':
      return requestMembers();
    case 'public-diaries':
      return requestPublicDiaires();
  }
}

function receiveItems(type, json) {
  switch (type) {
    case 'members':
      return receiveMembers(json);
    case 'public-diaries':
      return receivePublicDiaries(json);
  }
}

function getUrl(type) {
  switch (type) {
    case 'members':
      return API_Endpoints.get_members;
    case 'public-diaries':
      return API_Endpoints.get_public_diaries;
  }
}

export function fetchItems(type) {
  return dispatch => {
    dispatch(requestItems(type));
    return ajax_get(getUrl(type)).then(data =>
      dispatch(receiveItems(type, data.result))
    );
  };
}

function requestUser(isFetching = true) {
  return {
    type: 'REQUEST_USER',
    isFetching
  };
}

function receiveUser({ username, fullname, age }) {
  return {
    type: 'RECEIVE_USER',
    account: {
      username,
      fullname,
      age
    }
  };
}

function handleAuthErr(error) {
  return {
    type: 'HANDLE_AUTH_ERR',
    error
  };
}

function fetchUser({ username, password }, dispatch) {
  if (!username) {
    dispatch(handleAuthErr('Username is required'));
  } else if (!password) {
    dispatch(handleAuthErr('Password is required'));
  } else {
    dispatch(requestUser(true));
    return ajax_post(API_Endpoints.authenticate_user, { username, password })
      .then(data => {
        sessionStorage.setItem('token', data.token);
      })
      .catch(() => {
        const error = 'Username or password is invalid';
        dispatch(handleAuthErr(error));
        throw error;
      })
      .then(() => {
        return ajax_post(API_Endpoints.get_user, {}, true);
      })
      .then(data => {
        dispatch(receiveUser(data));
      })
      .catch(error => {
        dispatch(handleAuthErr(error));
      })
      .finally(() => {
        dispatch(requestUser(false));
      });
  }
}

export function login(data) {
  return dispatch => {
    return fetchUser(data, dispatch);
  };
}
