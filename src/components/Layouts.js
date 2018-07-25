/*
 * @file: Layouts.js
 * @description: Defined all Layouts for application
 * @date: 04.07.2018
 * @author: Jasdeep Singh
*/

import React from 'react';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/*************** Front Layout ***************/
export const frontLayout = props => (
  <section className="main-content frontend" id="home">
    <section className="content">{props.children}</section>
  </section>
);

/*************** Dashboard Layout ***************/
export const dashboardLayout = props => {
  let navClass = 'main-container';
  const navToggle = status => {
    console.log("status", status);
    navClass = status ? 'main-container collapse-sidebar' : 'main-container';
  };
  
  return (
    <div>
      <Header _navToggle={navToggle}/>
      <ToastContainer />
      <div className="appContent">
        <div id="myDIV" className="main-container">
          <Sidebar />
          {props.children}
        </div>
      </div>

      <Footer />
    </div>
  );
};
