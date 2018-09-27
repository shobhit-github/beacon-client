/*
 * @file: user.js
 * @description: Reducers and actions for store/manipulate Interview Records's  data
 * @date: 04.07.2018
 * @author: Jasdeep Singh
*/

import * as TYPE from "../../constants/action-types";

/******** Reducers ********/

export default function reducer(state = [], action) {
    switch (action.type) {
        case TYPE.SAVE_RECORD:
            const RIndex = state.findIndex(
                value => value.blob_str === action.data.blob_str && value.type === 3
            );
            if (RIndex === -1) {
                return [action.data, ...state];
            } else {
                state[RIndex].drive_path = action.data.drive_path;
                return [...state];
            }

        case TYPE.GET_RECORD:
            return action.data;

        case TYPE.UPDATE_RECORD:
            const index = state.findIndex(value => value._id === action.data._id);
            if (action.data.title) {
                state[index].title = action.data.title;
                state[index].markers = action.data.timeStamps;
            } else {
                state[index].type = action.data.type;
                state[index].status = action.data.status;
                state[index].drive_path = action.data.drive_path;
            }
            return [...state];

        case TYPE.UPDATE_RECORD_STATUS:
            const _index = state.findIndex(value => value._id === action.data._id);
            state[_index].status = action.data.status;
            return [...state];

        case TYPE.LOG_OUT:
            return [];

        default:
            return state;
    }
}
