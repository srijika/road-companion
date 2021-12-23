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

export default function request1(url, options) {
 
  const newOptions = { ...options };
      newOptions.headers = {
      Accept: 'application/json; ',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      ...newOptions.headers,
    };
      newOptions.body = JSON.stringify(newOptions.body);
  
  console.log("request1 : ",newOptions)
  
  return fetch(process.env.REACT_APP_ApiUrl + url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      return data;
    }
    )
    .catch(err => {
      console.log(err);
      return err
    });
}




