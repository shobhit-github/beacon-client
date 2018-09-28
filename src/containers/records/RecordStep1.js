import React, {Component} from "react";
import {Link} from "react-router-dom";

// ui components
import Chip from "@material-ui/core/Chip";

export default class RecordStep1 extends Component {
    state = {
        chipData: localStorage.chipData ? JSON.parse(localStorage.chipData) : []
    };

    handleDelete = data => () => {
        const chipData = [...this.state.chipData];
        const chipToDelete = chipData.indexOf(data);
        chipData.splice(chipToDelete, 1);
        this.setState({chipData});
    };

    saveChips = () => {
        localStorage.setItem("chipData", JSON.stringify(this.state.chipData));
        localStorage.getItem("checkTwo")
            ? localStorage.getItem("checkThree")
            ? this.props.history.push("/records/step_four")
            : this.props.history.push("/records/step_three")
            : this.props.history.push("/records/step_two");
    };

    addMarker = e => {
        if (e.key === "Enter") {
            this.state.chipData.push({label: this.refs.marker.value});
            this.refs.marker.value = null;
            this.setState(this.state);
        }
    };

    render() {
        return (
            <div className="main-content flex_main">
                <a href="#" className="back_dashboard_btn">
                    <img src="../../images/back.svg" alt=""/> Back to Dashboard
                </a>
                <div className="row record-step1">
                    <div className="step_section">
                        <div className="card text-center single">
                            <div className="beta-tag">Beta</div>
                            <div className="card-header">
                                <label className="step-count">STEP 1 of 4</label>

                                <h2>Choose your markers</h2>
                            </div>

                            <div className="card-block">
                                <p>
                                    Add up to six markers to use throughout your audio recording
                                    then begin your interview.
                                </p>

                                <div className="input-group">
                                    <label>Add a new marker</label>

                                    <input
                                        ref="marker"
                                        className="form-control"
                                        onKeyPress={this.addMarker}
                                        placeholder="Enter text to add a new marker"
                                    />

                                    <span>
                    <i className="add_icon"/>
                  </span>
                                </div>

                                <div className="chip-sec">
                                    {this.state.chipData.map((data, index) => {
                                        return (
                                            <Chip
                                                key={index}
                                                label={data.label}
                                                onDelete={this.handleDelete(data)}
                                                className="chip"
                                            />
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => this.saveChips()}
                                    disabled={!this.state.chipData.length}
                                    className="btn btn-primary"
                                >
                                    Next Step
                                </button>
                            </div>

                            <div className="card-footer">
                                <Link to="/records/step_two"> Skip this step </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
