/*
 * @file: index.js
 * @description: It Contain User Account Related Action Creators.
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 */

import {push} from "react-router-redux";
import RestClient from "../../utilities/RestClient";
import message from "../../utilities/messages";
import * as TYPE from "../../constants/action-types";
import {toastAction} from "../toast-actions";
//Action Creator For Reducers

export const login_Success = data => ({type: TYPE.LOGIN_SUCCESS, data: data});
export const update_profile = data => ({type: TYPE.UPDATE_PROFILE, data});
export const log_out = () => ({type: TYPE.LOG_OUT});

// Thunk Action Creators For Api

/****** action creator for login ********/
export const login = (params, cb) => {
    let remember = params.remember;
    delete params.remember;
    return dispatch => {
        RestClient.post("user/login", params)
            .then(result => {
                if (result.success) {
                    if (remember) {
                        result.data.remember = {
                            email: params.email,
                            password: params.password
                        };
                    } else {
                        result.data.remember = {};
                    }
                    dispatch(login_Success(result.data));
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

/****** action creator for register ********/
export const register = (params, cb) => {
    return dispatch => {
        RestClient.post("user/register", params)
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

/********** action creator to set Password  **********/
export const updateProfile = (params, cb) => {
    let _id = params._id,
        token = params.token;
    delete params._id;
    delete params.token;
    return dispatch => {
        RestClient.put(`user/${_id}`, params, token)
            .then(result => {
                if (result.success) {
                    delete params.password;
                    dispatch(update_profile(params));
                    toastAction(true, result.message);
                    cb(true);
                } else {
                    toastAction(false, result.message);
                    cb(false);
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

/********** action creator to set Password  **********/
export const forgotPassword = (params, cb) => {
    return dispatch => {
        RestClient.put(`user/forgotPassword`, params)
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

/********** action creator check token valid or not valid  **********/
export const checkToken = (token, cb) => {
    return dispatch => {
        RestClient.get(`user/checkToken/${token}`)
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

/********** action creator to set Password  **********/
export const setPassword = (params, type, cb) => {
    return dispatch => {
        RestClient.put(`user/password/${type}`, params)
            .then(result => {
                if (result.success) {
                    let res = {
                        status: true,
                        message: result.message,
                        type: message.success
                    };
                    toastAction(true, result.message);
                    cb(res);
                } else {
                    let res = {
                        status: false,
                        message: result.message,
                        type: message.error
                    };
                    toastAction(false, result.message);
                    cb(res);
                }
            })
            .catch(error => {
                let res = {
                    status: false,
                    message: message.commonError,
                    type: message.error
                };
                toastAction(false, message.error);
                cb(res);
            });
    };
};

/********** action creator for billing detail  **********/
export const billingDetail = (params, cb) => {
    return dispatch => {
        RestClient.get(`user/fetchPaymentInfo/${params.id}`)
            .then(result => {
                if (result.success) {
                    let res = {
                        status: true,
                        data: result.data
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

/******** action creator to user logout of the application **********/
export const logOut = (params, cb) => {
    return dispatch => {
        RestClient.delete("user/logout", "", params.token)
            .then(result => {
                if (result) {
                    dispatch(log_out());
                    dispatch(push("/"));
                    cb(true);
                }
            })
            .catch(error => {
                cb(false);
            });
    };
};
