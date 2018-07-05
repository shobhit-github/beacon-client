import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import RecordStep1 from "./records/RecordStep1";
import RecordStep2 from "./records/RecordStep2";
import RecordStep3 from "./records/RecordStep3";
import RecordStep4 from "./records/RecordStep4";


export default class Record extends Component {


    render() {


        return (

            <div className="main-content">


                <Switch>

                    <Route path="/records/step_one" component={RecordStep1}/>

                    <Route path="/records/step_two" component={RecordStep2}/>

                    <Route path="/records/step_three" component={RecordStep3}/>

                    <Route path="/records/step_four" component={RecordStep4}/>

                </Switch>


            </div>

        );

    }


}

