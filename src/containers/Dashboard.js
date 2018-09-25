import React from "react";
import { Link } from "react-router-dom";
import recordImage from "../assets/images/record_interview.svg";
import researchImage from "../assets/images/reserch.svg";

export default () => {
  return (
    <div className="main-content flex_main">
      <div className="flex_section"> 
          <div className="card text-center dashboard">
            <div className="beta-tag">Beta</div>
            <div className="card-header">
              <h2>Record an interview</h2>
            </div>
            <div className="card-block">
              <img src={recordImage} alt="Record Interview" />
              <p>
              Record a session and bookmark important moments as they happen. Remember to keep the call on speaker.
              </p>
              <Link to="/records/step_one" className="btn btn-primary">
                Get Started
              </Link>
            </div>
            <div className="card-footer">
              <a href="">Learn more</a>
            </div>
          </div> 
          <div className="card text-center dashboard">
            <div className="card-header">
              <h2>Synthesize my research</h2>
            </div>
            <div className="card-block">
              <img src={researchImage} alt="Research" />
              <p>
              Connect your Google account  to synthesize across docs.  Make sure your files are formatted correctly. 
              </p>
              <Link to="/google-drive" className="btn btn-primary">
                Open your Google Drive
              </Link>
            </div>
            <div className="card-footer">
              <Link to="">Learn more</Link> 
            </div>
          </div> 
      </div>
    </div>
  );
};
