import React from "react";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import "./_styles/sidebar.css";

const Sidebar = props => {
    const pathname = props.history.location.pathname,
        isLoginPage = pathname.indexOf("register") > -1,
        isRegisterPage = pathname.indexOf("login") > -1,
        isForgotPasswordPage = pathname.indexOf("forgot_password") > -1;

    return (
        !isLoginPage &&
        !isRegisterPage &&
        !isForgotPasswordPage && (
            <div className="sidebar">
                <ul className="sidenav">
                    <li
                        className={
                            pathname.includes("/dashboard")
                                ? " dashboard active"
                                : "dashboard"
                        }
                    >
                        <Link to="/dashboard">
                            <span>Dashboard</span>
                            <em className="tooltip_text">Dashboard</em>
                        </Link>
                    </li>
                    <li className={pathname.includes("doc") ? "files active" : "files"}>
                        <Link to="/docs">
                            <span>My Files</span>
                            <em className="tooltip_text">My Files</em>
                        </Link>
                    </li>

                    <li
                        className={
                            pathname.includes("/archives") ? "archive active" : "archive"
                        }
                    >
                        <Link to="/archives">
                            <span>Archives</span>
                            <em className="tooltip_text">Archives</em>
                        </Link>
                    </li>

                    <li className="help">
                        <a href="">
                            <span>Help</span>
                            <em className="tooltip_text">Help</em>
                        </a>
                    </li>
                </ul>
            </div>
        )
    );
};

export default withRouter(Sidebar);
