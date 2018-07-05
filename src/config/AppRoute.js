
/*
 * @file: AppRoute.js
 * @description: Defined all routers
 * @date: 04.07.2018
 * @author: Jasdeep Singh
*/

/************ React Pages according to layouts  *****************/

import React from "react";
import { Route } from "react-router-dom";

const AppRoute = ({ component: Component, layout: Layout, requireAuth:requireAuth, ...rest}) => (
  <Route {...rest} render={props => {
	  	requireAuth() ; 
	  	return ( 
	    <Layout>
	      <Component {...props} />
	    </Layout>
	  )}
	} 
  />
)

export default AppRoute;