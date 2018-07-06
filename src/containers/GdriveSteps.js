import React, {Component} from "react";
import {Link} from 'react-router-dom';

// ui components
import Chip from '@material-ui/core/Chip';
import gdrive from "./../../assets/images/gdrive.jpg";



export default class RecordStep1 extends Component {


    state = {
        chipData: localStorage.chipData?JSON.parse(localStorage.chipData):[]
    };



    render() {
        

        return (

            <div className="row record-step1">

                <div className="offset-sm-3 col-sm-6">

                    <div className="card text-center single">

                        <div className="back-link">
                          <i class="fa fa-chevron-left" aria-hidden="true"></i> back
                        </div>
                        
                        <div className="upload-file text-center">
                           GIF
                        </div>

                        <div className="card-block">

                            <p>We are processing your file. You can access it using the link below once it's ready.</p>

                        </div>
                        <div className="row justify-content-center">

                           <button className="btn drive-btn"><img src={gdrive}/> Not stored on drive yet</button>
                        </div>


                        <div className="card-block">

                            <h3> You're all set!</h3>

                            <p>Use the libnk below to access your file. If you have any feedback, questions, or comments send us a note to <span className="back-link"> hello@experiencebeacon.io </span></p>

                        </div>
                        <div className="row justify-content-center">

                           <button className="btn btn-primary"> Open my file</button>
                        </div>


                         <div className="card-block">

                            <h3> Something went wrong</h3>

                            <p>We couldn't process your files. <span className="back-link"> Go back </span> and try again. If you have any feedback, questions, or comments send us a note to  <span className="back-link"> hello@experiencebeacon.io </span>
                            </p>

                        </div>
                    </div>

                </div>

            </div>
        );
    }



    handleDelete = data => () => {

        const chipData = [...this.state.chipData];
        const chipToDelete = chipData.indexOf(data);
        chipData.splice(chipToDelete, 1);
        this.setState({chipData});
    };

    saveChips = () => {
        localStorage.setItem("chipData",JSON.stringify(this.state.chipData))        
        this.props.history.push('/records/step_two')
    }

    addMarker = (e) => {

        if (e.key === 'Enter') {
            this.state.chipData.push({label: this.refs.marker.value});
            this.refs.marker.value = null;
            this.setState(this.state);
        }
    };


}
