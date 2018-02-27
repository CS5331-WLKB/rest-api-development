import ajax_get from './utils/ajax_get';
import ajax_post from './utils/ajax_post';
import API_Endpoints from './utils/API_Endpoints';

export const REQUEST_MEMBERS = 'REQUEST_MEMBERS';
export const RECEIVE_MEMBERS = 'RECEIVE_MEMBERS';
export const REQUEST_PUBLIC_DIARIES = 'REQUEST_PUBLIC_DIARIES';
export const RECEIVE_PUBLIC_DIARIES = 'RECEIVE_PUBLIC_DIARIES';
export const REQUEST_MY_DIARIES = 'REQUEST_MY_DIARIES';
export const RECEIVE_MY_DIARIES = 'RECEIVE_MY_DIARIES';
export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const HANDLE_AUTH_ERR = 'HANDLE_AUTH_ERR';
export const UNAUTHENTICATE_USER = 'UNAUTHENTICATE_USER';
export const REMOVE_DIARY = 'REMOVE_DIARY';
export const SHOW_ALERT = 'SHOW_ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

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
    diaries: items
  };
}

function requestMyDiaries() {
  return {
    type: REQUEST_MY_DIARIES
  };
}

function receiveMyDiaries(items) {
  return {
    type: RECEIVE_MY_DIARIES,
    diaries: items
  };
}

function requestItems(type) {
  switch (type) {
    case 'members':
      return requestMembers();
    case 'public-diaries':
      return requestPublicDiaires();
    case 'my-diaries':
      return requestMyDiaries();
  }
}

function receiveItems(type, items) {
  switch (type) {
    case 'members':
      return receiveMembers(items);
    case 'public-diaries':
      return receivePublicDiaries(items);
    case 'my-diaries':
      return receiveMyDiaries(items);
  }
}

function getUrl(type) {
  switch (type) {
    case 'members':
      return API_Endpoints.get_members;
    case 'public-diaries':
      return API_Endpoints.get_public_diaries;
    case 'my-diaries':
      return API_Endpoints.get_my_diaries;
  }
}

export function fetchItems(type) {
  return dispatch => {
    dispatch(requestItems(type));
    let promise;
    if (type === 'my-diaries') {
      promise = ajax_post(getUrl(type), {}, true);
    } else {
      promise = ajax_get(getUrl(type));
    }
    return promise.then(data => dispatch(receiveItems(type, data.result)));
  };
}

function requestUser(isFetching = true) {
  return {
    type: REQUEST_USER,
    isFetching
  };
}

function receiveUser({ username, fullname, age }) {
  return {
    type: RECEIVE_USER,
    account: {
      username,
      fullname,
      age
    }
  };
}

function handleAuthErr(error) {
  return {
    type: HANDLE_AUTH_ERR,
    error
  };
}

function removeUser() {
  return {
    type: UNAUTHENTICATE_USER
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
        sessionStorage.setItem('account', JSON.stringify(data));
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

export function logout() {
  return dispatch => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return;
    }
    dispatch(requestUser());
    ajax_post(API_Endpoints.expire_user, {}, true)
      .catch(error => {
        dispatch(handleAuthErr(error));
      })
      .finally(() => {
        // remove all session data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('account');
        dispatch(removeUser());
        dispatch(requestUser(false));
      });
  };
}

export function checkIsAuthenticated() {
  return dispatch => {
    const isAuthenticated = sessionStorage.getItem('token');
    const account = sessionStorage.getItem('account');
    if (isAuthenticated && account) {
      return dispatch(receiveUser(JSON.parse(account)));
    }
  };
}

function removeDiary(diary) {
  return {
    type: REMOVE_DIARY,
    diary
  };
}

export function showAlert(alert) {
  return {
    type: SHOW_ALERT,
    alert
  };
}

export function dismissAlert(alert) {
  return {
    type: DISMISS_ALERT,
    alert
  };
}

export function deleteDiary(diary) {
  return dispatch => {
    dispatch(removeDiary(diary));
    return ajax_post(
      API_Endpoints.delete_diary,
      {
        id: diary.id
      },
      true
    )
      .then(() => {
        dispatch(
          showAlert({
            type: 'success',
            message: 'Diary is deleted successfully'
          })
        );
      })
      .catch(error => {
        dispatch(
          showAlert({
            type: 'danger',
            message: error
          })
        );
      });
  };
}
