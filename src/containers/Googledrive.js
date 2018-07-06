import React, {Component} from "react";
import {Link} from 'react-router-dom';

// ui components
import Chip from '@material-ui/core/Chip';



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
                          < back
                        </div>

                        <div className="card-header">

                            <label className="step-count">STEP 1 of 1</label>

                            <h2>Choose your folder</h2>

                        </div>

                        <div className="card-block">

                            <p>Select the folder that conatins the documents you want to summarize</p>
                            
                            <div className="drive-box">

                              <label> Google Drive </label>

                            </div>
                          

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
