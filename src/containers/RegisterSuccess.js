import React, { Component } from 'react';
import successBanner from '../assets/images/successsign.jpg';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FrontHeader from '../components/FrontHeader';

class RegisterSuccess extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
           <div className="col-sm-6 p-0">
            <div className="inner-wrapper">
              <div className="col-sm-12">
                <FrontHeader />               
              </div>

              <div className="center-img">Image TBD</div>
            </div>
          </div>

           <div className="col-sm-6">
            <div className="login-wrapper animated fadeIn register_wraper">
              <div className="text-right">
                <Link to="/" className="btn signin-btn">
                  Sign in
                </Link>
              </div>

              <div className="center-form register-form">
                <img src={successBanner} className="mb-3" width="80%"/>
                <label className="link-form-text">You're all set!</label>

                <form className="mt-1">                  
                    <h6> Sign in with the click on login link.</h6>  
                  <div className="col-sm-12 form-group">
                    <Link to="/" className="btn primary-btn">
                      Login{' '}
                    </Link>
                  </div>
                  <div className="col-sm-12 form-group">
                    <h6> Change my email from <br/>email@companyname.com </h6>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterSuccess;
