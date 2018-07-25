/*
 * @file: index.js
 * @description: It Contain User Account Related Action Creators.
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 */

import { push } from 'react-router-redux';
import RestClient from '../../utilities/RestClient';
import message from '../../utilities/messages';

/****** action creator for save user google drive detail ********/
export const saveUserDriveDetails = (params, cb) => {
  return dispatch => {
    RestClient.POST('save_drive_details', params)
      .then(result => {
        if (result.success) {
          let res = {
            status: true,
            message: result.message,
            type: message.success
          };
          cb(res);
        } else {
          let res = {
            status: false,
            message: result.message,
            type: message.error
          };

          cb(res);
        }
      })
      .catch(error => {
        let res = {
          status: false,
          message: message.commonError,
          type: message.error
        };
        cb(res);
      });
  };
};

/****** action creator for get doc from google and save  ********/
export const googleDocDetail = (params, cb) => {
  return dispatch => {
    RestClient.POST('save_tags', params)
      .then(result => { 
        if (result.success != 'false') {
          let res = {
            status: true,
            message: result.message,
            type: message.success,
            name: result.name,
            url: result.url
          };
          cb(res);
        } else {
          let res = {
            status: false,
            message: result.message,
            type: message.error
          };

          cb(res);
        }
      })
      .catch(error => {
        let res = {
          status: false,
          message: message.commonError,
          type: message.error
        };
        cb(res);
      });
  };
};

/****** action creator for save doc to google drive  ********/
export const googleSaveDoc = (params, cb) => {
  return dispatch => {
    RestClient.POST('save_doc', params)
      .then(result => {
        if (result.success != 'false') {
          let res = {
            status: true,
            message: result.message,
            type: message.success,
            url: result.url
          };
          cb(res);
        } else {
          let res = {
            status: false,
            message: result.message,
            type: message.error
          };

          cb(res);
        }
      })
      .catch(error => {
        let res = {
          status: false,
          message: message.commonError,
          type: message.error
        };
        cb(res);
      });
  };
};
