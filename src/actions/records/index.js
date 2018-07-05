/*
 * @file: index.js
 * @description: It Contain User Account Related Action Creators.
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 */


import RestClient from "../../utilities/RestClient";
import * as TYPE from "../../constants/action-types";

//Action Creator For Reducers

export const save_records = data => ({type: TYPE.SAVE_RECORD, data});
export const get_records = data => ({type: TYPE.GET_RECORD, data});

// Thunk Action Creators For Api

/****** action creator for login ********/
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
                        type: "Success!",
                        _id: result.data._id
                    };
                    cb(res);
                } else {
                    let res = {
                        status: false,
                        message: result.message,
                        type: "Error!"
                    };

                    cb(res);
                }
            })
            .catch(error => {
                let res = {
                    status: false,
                    message: "Something went wrong!",
                    type: "Error!"
                };

                cb(res);
            });
    };
};





