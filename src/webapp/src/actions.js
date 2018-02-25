import ajax_get from './utils/ajax_get';
import API_Endpoints from './utils/API_Endpoints';

export const REQUEST_MEMBERS = 'REQUEST_MEMBERS';
export const RECEIVE_MEMBERS = 'RECEIVE_MEMBERS';
export const REQUEST_PUBLIC_DIARIES = 'REQUEST_PUBLIC_DIARIES';
export const RECEIVE_PUBLIC_DIARIES = 'RECEIVE_PUBLIC_DIARIES';

function requestMembers() {
  return {
    type: REQUEST_MEMBERS
  };
}

function receiveMembers(json) {
  return {
    type: RECEIVE_MEMBERS,
    members: json.result
  };
}

function requestPublicDiaires() {
  return {
    type: REQUEST_PUBLIC_DIARIES
  };
}

function receivePublicDiaries(json) {
  return {
    type: RECEIVE_PUBLIC_DIARIES,
    publicDiaries: json.result
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
    return ajax_get(getUrl(type))
      .then(response => response.json())
      .then(json => dispatch(receiveItems(type, json)));
  };
}
