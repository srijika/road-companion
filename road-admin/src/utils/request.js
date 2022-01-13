import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(url, options) {

  const newOptions = { ...options }; //...defaultOptions,
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json; ',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
        ...newOptions.headers,
      };
      newOptions.body = newOptions.body;
    }
  }
  else {
    newOptions.headers = {
      Accept: 'application/json',
      Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      ...newOptions.headers,
    };
  }

  return fetch(process.env.REACT_APP_ApiUrl + url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      if (newOptions.method === 'DELETE' || data.status === 204) {
        return data.text ? data.text() : data;
      }
      return data;
    }
    )
    .catch(err => {
      console.log(err);
      return err
    });
}


