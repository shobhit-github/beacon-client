/*********** Routes for applications **************/
import React from "react";
import { Route,Switch } from "react-router-dom";
import AppRoute from "./AppRoute";
import Register from '../containers/Register';
import NotFound from "../components/NotFound";
import {frontLayout, dashboardLayout} from "../components/Layouts";
import ForgotPassword from "../containers/ForgotPassword";
import Login from "../containers/Login";
import RegisterPayment from "../containers/RegisterPayment";
import Home from "../containers/Home";

const Routers = ({store, history}) => {
	const state = store.getState(); 
	console.log(history.location.pathname)
	 /*********** Check authentications ***********/
    const requireAuth = () => {
        if(!state.user.loggedIn && history.location.pathname !== "/") {
           history.push( "/");
        } else if(state.user.loggedIn && history.location.pathname === "/"){
           history.push( "/dashboard");
        }
    };

	 return (
        <div>
            <Switch> 
                <AppRoute  
                    exact={true}
                    path="/" 
                    component={Login} 
                    requireAuth={requireAuth}
                    layout={frontLayout} 
                />

                <AppRoute  
                    exact 
                    path="/dashboard" 
                    component={Home} 
                    requireAuth={() => false}
                    layout={dashboardLayout} 
                />

                 <AppRoute  
                        exact 
                        path="/register" 
                        component={Register} 
                        requireAuth={() => false}
                        layout={frontLayout} 
                    />
                 <AppRoute
                        exact
                        path="/register_payment"
                        component={RegisterPayment}
                        requireAuth={() => false}
                        layout={frontLayout}
                    />
                 <AppRoute
                        exact
                        path="/forgot_password" 
                        component={ForgotPassword} 
                        requireAuth={() => false}
                        layout={frontLayout} 
                    />

                    <AppRoute 
                        exact
                        path="*" 
                        component={NotFound}
                        requireAuth={()=> false} 
                        layout={frontLayout}                                
                    />
			</Switch>
        </div>
    );
};

export default Routers;
