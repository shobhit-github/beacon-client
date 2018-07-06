/*
 * @file: index.js
 * @description: It Contain Records Related Action Creators.
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 */


import RestClient from "../../utilities/RestClient";
import message from "../../utilities/messages";
import * as TYPE from "../../constants/action-types";


//Action Creator For Reducers

export const save_records = data => ({type: TYPE.SAVE_RECORD, data});
export const get_records = data => ({type: TYPE.GET_RECORD, data});

// Thunk Action Creators For Api

/****** action creator for save records ********/
export const saveRecord = (params, cb) => {
    let userId = params._id;
    delete params._id;
    return dispatch => {
        RestClient.post(`transcriptions/uploadInterview/${userId}`, params)
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
                    cb({status:true});                
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




