import React from 'react';
import { Link } from 'react-router-dom';
import recordImage from '../assets/images/record_interview.png';
import researchImage from '../assets/images/reserch.png';

export default () => {
  return (
    <div className="main-content">
      <div className="row">
        <div className="offset-lg-1 offset-md-0 col-md-6 offset-lg-1 col-lg-5 offset-sm-1 col-sm-10">
          <div className="card text-center dashboard">
          <div className="beta-tag">Beta</div>
            <div className="card-header">
              <h2>Record an interview</h2>
            </div>
            <div className="card-block">
              <img src={recordImage} alt="Record Interview" />
              <p>
                Record an audio interview and bookmark important moments as they happen.
              </p>
              <Link to="/records/step_one" className="btn btn-primary">
                Get Started
              </Link>
            </div>
            <div className="card-footer">
              <a href="">Learn more</a>
            </div>
          </div>
        </div>
        <div className="offset-md-0 col-md-6 col-lg-5 offset-sm-1 col-sm-10">
          <div className="card text-center dashboard">
          
            <div className="card-header">
              <h2>Synthesize my research</h2>
            </div>
            <div className="card-block">
              <img src={researchImage} alt="Research" />
              <p>
                Select the Google Drive folder that contains the docs you want to synthesize.
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
    </div>
  );
};
