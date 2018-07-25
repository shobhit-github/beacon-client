import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { CircularProgress, Icon } from '@material-ui/core/es/index';
import { forgotPassword } from '../actions/user';
import FrontHeader from '../components/FrontHeader';
import AlertMsg from '../components/AlertMsg';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      validationErr: null
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  /*************** User Login *************/
  handleOnClick = event => {
    event.preventDefault();
    if (this.refs.email.value === '') {
      this.setState({ validationErr: 'Please enter email address.' });
    } else {
      this.setState({ processing: true });
      let context = this;
      this.props.forgotPassword({ email: this.refs.email.value }, res => {
        if (res.status) {
          context.setState({
            open: true,
            msg: res.message,
            msgType: res.type,
            msgStatus: res.status,
            processing: false,
            validationErr: null
          });
        } else {
          context.setState({
            open: true,
            msg: res.message,
            msgType: res.type,
            msgStatus: res.status,
            processing: false,
            validationErr: null
          });
        }
      });
    }
  };

  render() {
    let context = this,
      { processing, validationErr } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <AlertMsg
            onPress={() => context.setState({ open: false })}
            isShowingModal={context.state.open}
            msg={context.state.msg}
            type={context.state.msgType}
            status={context.state.msgStatus}
          />
          <div className="col-sm-7 p-0">
            <div className="inner-wrapper">
              <FrontHeader />
              <div className="center-img">Image TBD</div>
            </div>
          </div>

          <div className="col-sm-5">
            <div className="login-wrapper reset-module">
              <div className="col-sm-12 text-right">
                <Link to="/" className="btn signin-btn">
                  Sign in
                </Link>
              </div>

              <div className="col-sm-12 center-form">
                {validationErr && (
                  <div className="error-msg ">
                    <i className="material-icons">clear</i>
                    <span>{validationErr}</span>
                  </div>
                )}

                <div className="success-msg ">
                  <p>If you need additional assistance email hello@experiencebeacon.io</p>
                </div>

                <label>Reset Password</label>

                <p className="mt-3">
                  {' '}
                  Enter your email below and we'll send you an emailwith instructions to reset your
                  password.
                </p>
                <form onSubmit={this.handleOnClick}>
                  <div className="col-sm-12 form-group">
                    <input
                      type="email"
                      ref="email"
                      className="form-control"
                      placeholder="Your work email"
                    />
                  </div>

                  <div className="col-sm-12 form-group">
                    <button type="submit" className="btn primary-btn">
                      {processing ? (
                        <CircularProgress size={15} color={'inherit'} />
                      ) : (
                        `Reset my password`
                      )}
                    </button>
                  </div>
                </form>
                <div className="col-sm-12 bottom-bar">
                  <span className="form-link-text">
                    <a href="">Don't have an account? </a>
                  </span>

                  <span>
                    <Link to="/register">Sign up</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  user: PropTypes.object.isRequired,
  forgotPassword: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  forgotPassword: bindActionCreators(forgotPassword, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword);
