/*
 * @file: App.js
 * @description: Loaded data after rehydrated true
 * @date: 10.6.2018
 * @author: Monika Rani
 * */

import React, {Component} from 'react';  
import { persistStore } from "redux-persist";
import { PersistGate } from 'redux-persist/es/integration/react';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import Routers from './Routers'; 
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureStore from './configureStore';
import Loader from '../components/Loader';


export const history = createHistory();
/************ store configration *********/
const { persistor, store } = configureStore(history);

class App extends Component {  

  constructor() {
    super()
    this.state = { }
  }
  render() {
    return (
     <Provider store={store}> 
      <ConnectedRouter history={history}>
  	    <Router history={history}>  
  	      <Routers store={store} history={history}/>
  	    </Router>
      </ConnectedRouter> 
	   </Provider>
    );
  }

}


export default App;
