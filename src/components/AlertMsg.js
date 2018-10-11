/* 
      *                                                            *
    *****                                                        *****                             
      *                                                            *
        ==========================================================
        ==========                                      ==========
        ==========          Page for alert messages     ==========
        ==========                                      ==========
        ==========================================================
      *                                                            *
    *****                                                        *****   
      *                                                            *
*/

import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// ui dependencies
import Checkbox from "@material-ui/core/Checkbox";


const AlertMsg = props => {

    return (
        <div>
            {props.isShowingModal && (
                <SweetAlert
                    showCancel={props.status === "warning"}
                    type={
                        props.status === false
                            ? "error"
                            : props.status === "warning"
                            ? "warning"
                            : "success"
                    }
                    title={props.type}
                    allowEscape
                    confirmBtnText={props.status === "warning" ? "Delete forever" : "Close"}
                    confirmBtnBsStyle={
                        props.status === false || props.status === "warning"
                            ? "primary"
                            : "success"
                    }
                    onConfirm={
                        props.status === "warning"
                            ? () => props.actionConfirmed()
                            : () => props.onPress()
                    }
                    cancelBtnBsStyle="default"
                    onCancel={() => props.onPress()}
                >
                    {props.msg}

                    <div className="form-check text-left">
                        <Checkbox
                            id="check2"
                            color="primary"
                        />

                        <label className="form-check-label" for="check2">
                            {" "}
                            Do not show this message again{" "}
                        </label>
                    </div>
                    <span className="close_popup"></span>
                </SweetAlert>
            )}
        </div>
    );
};

export default AlertMsg;
