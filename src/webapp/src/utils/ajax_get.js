import fetch from 'cross-fetch';

const ajax_get = function(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        return data.result;
      } else {
        throw data.error;
      }
    });
};

export default ajax_get;
