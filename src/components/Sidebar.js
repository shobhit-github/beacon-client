import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
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
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li className={pathname.includes("/docs") ? "files active" : "files"}>
            <Link to="/docs">My Files</Link>
          </li>

          <li className="help">
            <a href="">Help</a>
          </li>

          <li className="archive">
            <a href="">Archives</a>
          </li>
        </ul>
      </div>
    )
  );
};

export default withRouter(Sidebar);
