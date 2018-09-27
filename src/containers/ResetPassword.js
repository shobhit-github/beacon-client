import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import {Icon} from "@material-ui/core/es/index";
import {CircularProgress} from "@material-ui/core/es/index";
import {checkToken, setPassword} from "../actions/user";
import FrontHeader from "../components/FrontHeader";
import AlertMsg from "../components/AlertMsg";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            error: false,
            errorMessage: null,
            reset: false,
            password: false,
            confirm_password: false
        };
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    componentWillMount() {
        const {match, checkToken} = this.props;
        if (match.params && match.params.token) {
            checkToken(match.params.token, res => {
                if (!res.status) {
                    this.setState({error: true, errorMessage: res.message});
                }
            });
        }
    }

    /************ Show/hide passowrd *********/
    changePasswordVisibility() {
        this.setState({
            password: !this.state.password
        });
        this.refs.password.setAttribute(
            "type",
            !this.state.password ? `text` : `password`
        );
    }

    changeConfirmPasswordVisibility() {
        this.setState({
            confirm_password: !this.state.confirm_password
        });
        this.refs.confirm_password.setAttribute(
            "type",
            !this.state.confirm_password ? `text` : `password`
        );
    }

    /************ Submit change password *********/
    handleChangePassword(event) {
        event.preventDefault();
        const {match, setPassword} = this.props,
            passowrd = this.refs.password.value,
            confirm_password = this.refs.confirm_password.value;
        if (passowrd === confirm_password) {
            this.setState({reset: true});
            setPassword(
                {token: match.params.token, password: passowrd},
                "reset",
                res => {
                    if (res.status) {
                        this.setState({
                            open: true,
                            msg: res.message,
                            msgType: res.type,
                            msgStatus: res.status,
                            reset: false
                        });
                        this.refs.password.value = "";
                        this.refs.confirm_password.value = "";
                    } else {
                        this.setState({
                            open: true,
                            msg: res.message,
                            msgType: res.type,
                            msgStatus: res.status,
                            reset: false
                        });
                    }
                }
            );
        } else {
            this.setState({
                errorMessage: "Password and comfirm password does't match."
            });
        }
    }

    render() {
        let context = this;
        const {error, errorMessage, reset} = this.state;
        return (
            <div className="container-fluid">
                <div className="row">
                    <AlertMsg
                        onPress={() => context.setState({open: false})}
                        isShowingModal={context.state.open}
                        msg={context.state.msg}
                        type={context.state.msgType}
                        status={context.state.msgStatus}
                    />
                    <div className="col-sm-12 col-md-6 p-0">
                        <div className="inner-wrapper">
                            <div className="col-sm-12">
                                <FrontHeader/>
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
                                <form onSubmit={this.handleChangePassword}>
                                    <label>New password</label>
                                    <p className="mt-3">
                                        {" "}
                                        Enter your email below and we'll send you an emailwith
                                        instructions to reset your password.
                                    </p>

                                    <div className="col-sm-12 form-group">
                                        <div className="input-group">
                                            <input
                                                name="password"
                                                type="password"
                                                ref="password"
                                                className="form-control"
                                                placeholder="New Password"
                                            />

                                            <div className="input-group-append">
                        <span
                            onClick={() => this.changePasswordVisibility()}
                            className="input-group-text"
                        >
                          <Icon>
                            {" "}
                              {!this.state.password
                                  ? `visibility_off`
                                  : `visibility`}
                          </Icon>
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 form-group">
                                        <div className="input-group">
                                            <input
                                                name="confirm_password"
                                                type="password"
                                                ref="confirm_password"
                                                className="form-control"
                                                placeholder="Confirm Password"
                                                onChange={e => {
                                                    if (this.refs.password.value === e.target.value) {
                                                        this.setState({errorMessage: null});
                                                    }
                                                }}
                                            />

                                            <div className="input-group-append">
                        <span
                            onClick={() => this.changeConfirmPasswordVisibility()}
                            className="input-group-text"
                        >
                          <Icon>
                            {" "}
                              {!this.state.confirm_password
                                  ? `visibility_off`
                                  : `visibility`}
                          </Icon>
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="error-msg ">{errorMessage}</div>

                                    <div className="col-sm-12 form-group">
                                        <button
                                            disabled={errorMessage || reset}
                                            type="submit"
                                            className="btn primary-btn"
                                        >
                                            {reset ? (
                                                <CircularProgress size={15} color={"inherit"}/>
                                            ) : (
                                                `Change my password`
                                            )}
                                        </button>
                                    </div>

                                    <div className="col-sm-12 bottom-bar">
                    <span className="form-link-text">
                      Don't have an account?
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

ResetPassword.propTypes = {
    user: PropTypes.object.isRequired,
    checkToken: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    checkToken: bindActionCreators(checkToken, dispatch),
    setPassword: bindActionCreators(setPassword, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword);
