/*
 * @file: Connection.js
 * @description: Connection file for the application
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 * */

"use strict";

let runningUrl = "172.24.0.194:4101",
  zomatoApp = `${window.location.protocol}//developers.zomato.com`,
  httpUrl = `${window.location.protocol}//${runningUrl}`;
// httpUrl = "https://1d41aef3.ngrok.io";

class Connection {
  static getResturl() {
    return `${httpUrl}/`;
  }

  static getBaseUrl() {
    return httpUrl;
  }
}

module.exports = Connection;
