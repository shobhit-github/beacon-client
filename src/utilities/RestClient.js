/*
 * @file: RestClient.js
 * @description: Connection file for the application
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 * */

"use strict";

import Connection  from "../constants/Connection";
import querystring from "querystring";
import axios from 'axios';

var config = {
    headers: {'Content-Type': 'application/json' }
};

class RestClient {
   
    static post(url, params) {
        let context = this;
        
        return new Promise(function(fulfill, reject) {
          
           //config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post(Connection.getResturl()+url, JSON.stringify(params), config)
             
            .then(function (response) {
                fulfill(response.data);
               
            })
            .catch(function (error) {
                 fulfill(error.response.data);
            });

               
               
        });
    }

    static put(url, params) {
        let context = this;

        return new Promise(function(fulfill, reject) {
            axios.put(Connection.getResturl()+url, JSON.stringify(params), config)
            .then(function (response) {
                fulfill(response.data);
            })
            .catch(function (error) {
                 fulfill(error.response.data);
            });
        }); 
       
    }

    static delete(url, params) {
        let context = this;
        let query = querystring.stringify(params);
        return new Promise(function(fulfill, reject) {
            axios.delete(Connection.getResturl()+url + "?" + query, config)
            .then(function (response) {               
                fulfill(response.data);                
            })
            .catch(function (error) {                
                 fulfill(error.response.data);
            });
        });
    }


    static get(url, params) {
        let context = this;
        let query = querystring.stringify(params);
         
        return new Promise(function(fulfill, reject) {
            
           
            axios.get(Connection.getResturl()+url + "?" + query, config)

            .then(function (response) {              
                fulfill(response.data);               
            })
            .catch(function (error) {                
                 fulfill(error.response.data);
            });
               
        });
    }

}

export default RestClient;
