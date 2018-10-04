/*
 * @file: index.js
 * @description: It Contain Records Related Action Creators.
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 */

import RestClient from "../../utilities/RestClient";
import message from "../../utilities/messages";
import * as TYPE from "../../constants/action-types";
import {toastAction} from "../toast-actions";
//Action Creator For Reducers

export const save_records = data => ({type: TYPE.SAVE_RECORD, data});
export const get_records = data => ({type: TYPE.GET_RECORD, data});
export const update_records = data => ({type: TYPE.UPDATE_RECORD, data});
export const update_records_status = data => ({
    type: TYPE.UPDATE_RECORD_STATUS,
    data
});
// Thunk Action Creators For Api

/****** action creator for save records ********/
export const saveRecord = (params, cb) => {
    const userId = params.get("_id"),
        token = params.get("token");
    params.delete("_id");
    params.delete("token");
    return dispatch => {
        RestClient.file(`transcriptions/uploadInterview/${userId}`, params, token)
            .then(result => {
                if (result.success) {
                    dispatch(save_records(result.data));
                    let res = {
                        status: true,
                        message: result.message,
                        type: message.success,
                        _id: result.data._id
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

/****** action creator for get records ********/
export const getRecord = (params, cb) => {
    return dispatch => {
        RestClient.get(`transcriptions/fetchAllInterview/${params._id}`)
            .then(result => {
                if (result) {
                    dispatch(get_records(result));
                    cb({status: true});
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

/****** action creator for get records ********/
export const getHistory = (params, cb) => {
    return dispatch => {
        RestClient.get(`transcriptions/fetchDocumentHistory/${params._id}`)
            .then(result => {
                if (result) {
                    cb({status: true, data: result.data});
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

/****** action creator for save records ********/
export const updateRecord = (params, cb) => {
    let _id = params._id,
        token = params.token;
    delete params._id;
    delete params.token;
    return dispatch => {
        RestClient.put(`transcriptions/interview_update/${_id}`, params, token)
            .then(result => {
                if (result.success) {
                    toastAction(true, "Record Updated!");
                    params._id = _id;
                    dispatch(update_records(params));
                    cb(true);
                } else {
                    toastAction(false, result.message);
                    cb(false);
                }
            })
            .catch(error => {
                toastAction(false, message.commonError);
                cb(false);
            });
    };
};

/****** action creator for save records ********/
export const updateRecordStatus = (params, cb) => {
    let _id = params._id,
        token = params.token;
    delete params._id;
    delete params.token;
    return dispatch => {
        RestClient.put(`transcriptions/interview_status/${_id}`, params, token)
            .then(result => {
                if (result.success) {
                    result.message =
                        params.status === 3
                            ? "Record Deleted successfully!"
                            : result.message;
                    toastAction(true, result.message);
                    params._id = _id;
                    dispatch(update_records_status(params));
                    cb(true);
                } else {
                    toastAction(false, result.message);
                    cb(false);
                }
            })
            .catch(error => {
                toastAction(false, message.commonError);
                cb(false);
            });
    };
};

/****** action creator for save records ********/
export const saveSynthesisDoc = (params, cb) => {
    let _id = params._id,
        token = params.token;
    delete params._id;
    delete params.token;
    return dispatch => {
        RestClient.post(`transcriptions/saveSynthesisDoc/${_id}`, params, token)
            .then(result => {
                if (result.success) {
                    toastAction(true, result.message);
                    dispatch(save_records(result.data));
                    cb({status: true, _id: result.data._id});
                } else {
                    toastAction(false, result.message);
                    cb({status: false});
                }
            })
            .catch(error => {
                toastAction(false, message.commonError);
                cb({status: false});
            });
    };
};
