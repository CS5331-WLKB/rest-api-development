import fetch from 'cross-fetch';

const ajax_post = function(url, data = {}, isAuthenticated = false) {
  if (isAuthenticated) {
    data.token = sessionStorage.getItem('token');
  }
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        return data;
      } else {
        throw data.error;
      }
    });
};

export default ajax_post;
