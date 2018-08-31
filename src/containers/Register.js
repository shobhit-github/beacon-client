import React, { Component } from 'react';
import lock from '../assets/images/lock.png';
import sale from '../assets/images/sale-banner.png';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CircularProgress, Icon } from '@material-ui/core/es/index';
import FrontHeader from '../components/FrontHeader';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerError: null,
      agreed: false
    };
  }

  changePasswordVisibility = () => {
    this.setState({
      password_visibility: !this.state.password_visibility
    });
    this.refs.password.setAttribute('type', !this.state.password_visibility ? `text` : `password`);
  };

  passDataToPaymentSection = evt => {
    evt.preventDefault();

    if (!this.refs.name.value || !this.refs.email.value || !this.refs.password.value) {
      this.setState({
        registerError: 'Please enter required fields.'
      });
      return false;
    } else if(!this.state.agreed){
      this.setState({
        registerError: 'Please select agree the terms.'
      });
      return false;
    } 
    this.props.history.push('/register-payment', {
      email: this.refs.email.value,
      name: this.refs.name.value,
      password: this.refs.password.value,
      plan_type : this.state.plan_type
    });
  };
  changeBillingPlan = evt => {
    this.setState({
      ...this.state,
      ...{ plan_type: !evt.target.checked ? `startup-plan-yr` : `startup-plan` }
    });
  };
  render() {
    const { registerError, registerIn, agreed } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 p-0">
            <div className="inner-wrapper">
              <div className="col-sm-12">
                <FrontHeader />               
              </div>
              <div className="col-sm-12">
                <div className="billing-section">
                  <label>Choose a billing cycle</label>

                  <div className="d-flex plan-action">
                    <span className="plan-name">
                      {' '}
                      <img src={sale} className="sale-img" />Yearly
                    </span>

                    <span>
                      <label className="switch">
                        <input type="checkbox" onChange={this.changeBillingPlan} />

                        <span className="slider round"> </span>
                      </label>
                    </span>

                    <span className="plan-name"> Monthly </span>
                  </div>

                  <div className="details-container">
                    <p className="head-title">Monthly</p>

                    <p className="form-link-text">
                      Document your user interviews faster and get more from your research over
                      time.
                    </p>

                    <ul className="points-list">
                      <li>
                        <i className="material-icons">done</i>{' '}
                        <span>Tag important moments live , during user interviews</span>
                      </li>

                      <li>
                        <i className="material-icons">done</i>{' '}
                        <span> Synthesize your researchacross Google docs</span>
                      </li>

                      <li>
                        <i className="material-icons">done</i>{' '}
                        <span> Documents user insights quickly and efficiently </span>
                      </li>
                    </ul>

                    <div className="price-container">
                      <div className="value">
                        <span>
                          $<label>13</label>*
                        </span>

                        <span>/MO</span>
                      </div>

                      <div className="discount">Save 24 $ a year</div>
                    </div>
                  </div>
                </div>
              </div>
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
                {registerError && (
                  <div className="error-msg ">
                    <i className="material-icons">clear</i>
                    <span> {registerError} </span>
                  </div>
                )}

                <label>Get started with Beacon</label>

                <form className="login_form">
                  <p>1. Create an account</p>

                  <div className="col-sm-12 form-group">
                    <input
                      ref="name"
                      type="text"
                      placeholder="Full name"
                      className="form-control"
                    />
                  </div>

                  <div className="col-sm-12 form-group">
                    <input
                      ref="email"
                      type="text"
                      placeholder="Your work email"
                      className="form-control"
                    />
                  </div>

                  <div className="col-sm-12 form-group m_btm30">
                    <div className="input-group">
                      <input
                        ref="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                      />
                      <div className="input-group-append">
                        <span onClick={this.changePasswordVisibility} className="input-group-text">
                          <Icon>
                            {' '}
                            {!this.state.password_visibility ? `visibility_off` : `visibility`}
                          </Icon>
                        </span>
                      </div>
                    </div>
                  </div>

                  <label className="checkbox" onClick={() => this.setState({agreed: !agreed})}> <input type="checkbox"/> 
                  I agree to the Terms of Service and Privacy Policy</label>

                  <div className="col-sm-12 form-group">
                    <button
                      type="button"
                      onClick={this.passDataToPaymentSection}
                      disabled={registerIn}
                      className="btn primary-btn"
                    >
                      {!registerIn ? `Continue` : <CircularProgress size={15} color={'white'} />}
                    </button>
                  </div>

                  <div className="col-lg-12 next-step-bar mt-5">
                    <label>
                      2. Payment <img src={lock} />
                    </label>

                    <p>Sign up and proceed to payment</p>
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

Register.contextTypes = {
  store: PropTypes.object.isRequired
};

Register.propTypes = {
  user: PropTypes.string,
  registerError: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { auth } = state;

  if (auth) {
    return auth;
  }
  return { user: null };
}

export default connect(mapStateToProps)(Register);
