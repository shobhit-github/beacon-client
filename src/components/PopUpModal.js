import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import moment from "moment";

const styles = theme => ({
    paper: {
        position: "absolute",
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4
    }
});

const PopUpModal = ({
                        open,
                        data,
                        _handleClose,
                        classes,
                        onSelectHistoryRecord
                    }) => {
    const getModalStyle = () => {
        const top = 20;
        const right = 11;

        return {
            top: `${top}%`,
            right: `${right}%`,
            transform: `translate(-${top}%, -${right}%)`
        };
    };

    return (
        <div>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={_handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography
                        variant="title"
                        id="modal-title"
                        className="history-title"
                    >
                        History of Changes
                    </Typography>
                    <div variant="subheading" id="simple-modal-description">
                        <ul className="history-listing" style={{listStyle: "none"}}>
                            {data.length > 0
                                ? data.map((row, index) => (
                                    <li
                                        style={{cursor: "pointer"}}
                                        onClick={() => onSelectHistoryRecord(row)}
                                        key={index}
                                    >
                                        {" "}
                                        {moment(row.created_at).format("LLL")}
                                    </li>
                                ))
                                : "History not available!"}
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

PopUpModal.propTypes = {
    open: PropTypes.bool.isRequired,
    _handleClose: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    onSelectHistoryRecord: PropTypes.func.isRequired
};

export default withStyles(styles)(PopUpModal);
