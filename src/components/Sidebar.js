import React, {Component} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import "./_styles/sidebar.css";



class Sidebar extends Component {



    render() {

        const pathname = this.props.history.location.pathname;
        const isLoginPage = pathname.indexOf("register") > -1;
        const isRegisterPage = pathname.indexOf("login") > -1;
        const isForgotPasswordPage = pathname.indexOf("forgot_password") > -1;

        return (

            !isLoginPage && !isRegisterPage && !isForgotPasswordPage &&

            <div className="sidebar">

                <ul className="sidenav">

                    <li className="dashboard active"><a href="">Dashboard</a></li>

                    <li className="files"><a href="">My Files</a></li>

                    <li className="help"><a href="">Help</a></li>

                    <li className="archive"><a href="">Archives</a></li>

                </ul>

            </div>

        );
    }
}

Sidebar.propTypes = {
    user: PropTypes.string,
    // handleLogout: PropTypes.func.isRequired
};

export default withRouter(Sidebar);

