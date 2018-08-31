/* 
      *                                                            *
    *****                                                        *****                             
      *                                                            *
        ==========================================================
        ==========                                      ==========
        ==========              Front header            ==========
        ==========                                      ==========
        ==========================================================
      *                                                            *
    *****                                                        *****   
      *                                                            *
*/

import React from 'react';

export default () => {
  return (
      <nav className="navbar main_navbar navbar-expand-lg">
        <a className="navbar-brand logo_text" href="#">Logo</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"><img src="../../images/head_menu.svg" alt=""/></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto"> 
            <li className="nav-item">
              <a className="nav-link" href="#">Nav Item 1</a>
            </li> 
            <li className="nav-item">
              <a className="nav-link" href="#">Nav Item 2</a>
            </li> 
            <li className="nav-item">
              <a className="nav-link" href="#">Nav Item 3</a>
            </li>  
          </ul> 
        </div>
      </nav>
  );
};
