import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class GoogleDrive extends Component {
  render() {
    return (
      <div className="row record-step1">
        <div className="offset-sm-3 col-sm-6">
          <div className="card text-center single">
            <div className="back-link">
              <Link to="/dashboard">
                <i className="fa fa-chevron-left" aria-hidden="true" /> back
              </Link>
            </div>

            <div className="card-header">
              <label className="step-count">STEP 1 of 1</label>

              <h2>Choose your folder</h2>
            </div>
            <div className="card-block">
              <p>
                Select the folder that conatins the documents you want to
                summarize
              </p>

              <div className="drive-box">
                <label> Select Google Drive </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
