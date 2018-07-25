/*
 * @file: RestClient.js
 * @description: Connection file for the application
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 * */

import Connection from '../constants/Connection';
import querystring from 'querystring';
import axios from 'axios';

var config = {
  headers: { 'Content-Type': 'application/json' }
};

class RestClient {
  static post(url, params, token) {
    return new Promise(function(fulfill, reject) {
      config.headers['authorization'] = token;
      axios
        .post(Connection.getResturl(url), JSON.stringify(params), config)

        .then(function(response) {
          fulfill(response.data);
        })
        .catch(function(error) {
          if (error && error.response) {
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static POST(url, params, token) {
    return new Promise(function(fulfill, reject) {
      // config.headers["authorization"] = token;
      axios
        .post(Connection.getThirdPartyApiUrl(url), JSON.stringify(params), config)

        .then(function(response) {
          fulfill(response.data);
        })
        .catch(function(error) {
          if (error && error.response) {
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static put(url, params, token) {
    return new Promise(function(fulfill, reject) {
      config.headers['authorization'] = token;
      axios
        .put(Connection.getResturl(url), JSON.stringify(params), config)
        .then(function(response) {
          fulfill(response.data);
        })
        .catch(function(error) {
          if (error && error.response) {
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static get(url, params, token) {
    let query = querystring.stringify(params);
    return new Promise(function(fulfill, reject) {
      config.headers['authorization'] = token;
      axios
        .get(`${Connection.getResturl(url)}?${query}`, config)

        .then(function(response) {
          fulfill(response.data);
        })
        .catch(function(error) {
          if (error && error.response) {
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }

  static delete(url, params, token) {
    let query = querystring.stringify(params);
    return new Promise(function(fulfill, reject) {
      config.headers['authorization'] = token;
      axios
        .delete(`${Connection.getResturl(url)}?${query}`, config)
        .then(function(response) {
          fulfill(response.data);
        })
        .catch(function(error) {
          if (error && error.response) {
            fulfill(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  }
}

export default RestClient;
