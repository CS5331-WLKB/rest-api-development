import fetch from 'cross-fetch';

const ajax_get = function(url) {
  return fetch(url);
};

export default ajax_get;
