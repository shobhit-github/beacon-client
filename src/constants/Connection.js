/*
 * @file: Connection.js
 * @description: Connection file for the application
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 * */

const runningUrl = "ec2-34-229-162-12.compute-1.amazonaws.com:4101",
  httpUrl = `${window.location.protocol}//${runningUrl}`;
// httpUrl = "https://1d41aef3.ngrok.io";

class Connection {
  static getResturl(url) {
    return `${httpUrl}/${url}`;
  }

  static getBaseUrl() {
    return httpUrl;
  }
}

module.exports = Connection;
