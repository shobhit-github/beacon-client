/*
 * @file: Connection.js
 * @description: Connection file for the application
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 * */

import { environment as PATH } from './app-config';

const httpUrl = `${window.location.protocol}//${
  window.location.protocol === 'http:' ? PATH.STAGING_API_URL : PATH.STAGING_API_URL
}`;

class Connection {
  static getResturl(url) {
    return `${httpUrl}/${url}`;
  }
  static getBaseUrl() {
    return httpUrl;
  }
  static getThirdPartyApiUrl(url) {
    return `${PATH.THIRD_PARTY_API_URL}/${url}`;
  }
}

export default Connection;
