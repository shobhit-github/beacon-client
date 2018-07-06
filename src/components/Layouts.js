/*
 * @file: Layouts.js
 * @description: Defined all Layouts for application
 * @date: 04.07.2018
 * @author: Jasdeep Singh
*/

import React from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Header from "./Header";

/*************** Front Layout ***************/
export const frontLayout = props => (
  <section className="main-content frontend" id="home">
    <section className="content">{props.children}</section>
  </section>
);

/*************** Dashboard Layout ***************/
export const dashboardLayout = props => {
  let { history } = props.children.props,
    PAGE_NAME = history.location.pathname.split("/")[1].replace(/-/gi, " ");
  return (
    <div>
      <Header />

      <div className="appContent">
        <div className="main-container collapse-sidebar">
          <Sidebar />

          {props.children}
        </div>
      </div>

      <Footer />
    </div>
  );
};
