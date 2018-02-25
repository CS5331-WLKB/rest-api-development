const BASE_API = 'http://localhost:8080';

const relativePaths = {
  get_members: '/meta/members',
  authenticate_user: '/users/authenticate',
  register_user: '/users/register',
  expire_user: '/users/expire',
  get_user: '/users',
  get_public_diaries: '/diary',
  get_private_diaries: '/diary',
  create_diary: '/diary/create',
  delete_diary: '/diary/delete',
  toggle_diary_permission: '/diary/permission'
};

const API_Endpoints = {};

Object.keys(relativePaths).forEach(key => {
  API_Endpoints[key] = `${BASE_API}${relativePaths[key]}`;
});

export default API_Endpoints;
