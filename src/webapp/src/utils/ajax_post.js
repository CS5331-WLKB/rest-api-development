import fetch from 'cross-fetch';

const ajax_post = function(url, data = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  });
};

export default ajax_post;
