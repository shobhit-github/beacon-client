import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { CircularProgress, Icon } from "@material-ui/core/es/index";
import { login } from "../actions/user";
import AlertMsg from "../components/AlertMsg";
import FrontHeader from "../components/FrontHeader";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password_visibility: false,
      validationErr: null,
      open: false,
      loggingIn: false,
      remember: false
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    const { remember } = this.props.user;
    if (Object.keys(remember).length) {
      this.setState({
        remember: true,
        email: remember.email,
        password: remember.password
      });
    } else {
      this.setState({ remember: false, email: "", password: "" });
    }
  }

  /*************** User Login *************/
  handleLogin = event => {
    event.preventDefault();
    if (this.refs.username.value === "" || this.refs.password.value === "") {
      this.setState({ validationErr: "Email and password is required!" });
    } else {
      let context = this,
        params = {
          email: this.refs.username.value,
          password: this.refs.password.value,
          remember: this.state.remember
        };
      this.setState({ loggingIn: true });
      this.props.login(params, res => {
        if (res.status) {
          this.refs.username.value = this.refs.password.value = ``;
          context.props.history.replace("/dashboard");
        } else {
          context.setState({
            open: true,
            msg: res.message,
            msgType: res.type,
            msgStatus: res.status,
            loggingIn: false,
            validationErr: null
          });
        }
      });
    }
  };

  changePasswordVisibility = () => {
    this.setState({
      password_visibility: !this.state.password_visibility
    });
    this.refs.password.setAttribute(
      "type",
      !this.state.password_visibility ? `text` : `password`
    );
  };

  /************ Remember me function *********/
  remember() {
    this.setState({ remember: this.refs.remember.checked });
  }

  render() {
    let context = this;
    const { user } = this.props,
      { loggingIn, validationErr, remember } = this.state;

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
          <div className="col-sm-12 col-md-6 p-0">
            <div className="inner-wrapper">
              <div className="col-sm-12">
                <FrontHeader />
              </div>
              <div className="center-img">Image TBD</div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6">
            <div className="login-wrapper animated fadeIn">
              <div className="col-sm-12 center-form">
                {!user.loggedIn &&
                  validationErr && (
                    <div className="error-msg ">
                      <i className="material-icons">clear</i>{" "}
                      <span> {this.state.validationErr}. </span>
                    </div>
                  )}

                <label>Welcome to Beacon</label>

                <form onSubmit={this.handleLogin} className="login_form mb-4">
                  <div className="col-sm-12 form-group">
                    <input
                      ref="username"
                      type="email"
                      placeholder="Your work email"
                      className="form-control"
                      value={this.state.email}
                      onChange={e => this.setState({ email: e.target.value })}
                    />
                  </div>

                  <div className="col-sm-12 form-group">
                    <div className="input-group">
                      <input
                        type="password"
                        ref="password"
                        className="form-control"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={e =>
                          this.setState({ password: e.target.value })
                        }
                      />

                      <div className="input-group-append">
                        <span
                          onClick={this.changePasswordVisibility}
                          className="input-group-text"
                        >
                          <Icon>
                            {" "}
                            {!this.state.password_visibility
                              ? `visibility_off`
                              : `visibility`}
                          </Icon>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 form-group">
                    <button
                      disabled={loggingIn}
                      type="submit"
                      className="btn primary-btn"
                    >
                      {loggingIn ? (
                        <CircularProgress size={15} color={"inherit"} />
                      ) : (
                        `Sign in`
                      )}
                    </button>
                  </div>

                  <div className="col-sm-12 p-4">
                    <span className="float-left form-link-text">
                      <label className="checkbox-wrap">
                        Remember me
                        {remember ? (
                          <input
                            type="checkbox"
                            ref="remember"
                            name="remember"
                            onChange={() => this.remember()}
                            checked
                          />
                        ) : (
                          <input
                            type="checkbox"
                            ref="remember"
                            name="remember"
                            onChange={() => this.remember()}
                          />
                        )}
                        <span className="checkmark"> </span>
                      </label>
                    </span>

                    <span className="float-right form-link-text">
                      <Link to="/forgot-password">
                        Forgot
                        <br />
                        Password?
                      </Link>
                    </span>
                  </div>

                  <div className="col-sm-12 bottom-bar">
                    <span className="form-link-text">
                      <a href="">
                        Don't have an <br />
                        account?{" "}
                      </a>
                    </span>

                    <span>
                      <Link to="/register">Sign up</Link>
                    </span>
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

Login.propTypes = {
  user: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
