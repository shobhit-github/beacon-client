import React, {Component} from "react";
import AudioRecorder from 'react-audio-recorder';
import { ReactMic } from 'react-mic';
import Timer from '../../../node_modules/easytimer.js/dist/easytimer';
import {connect} from "react-redux";
import {saveRecord} from "../../actions/records";
import {Icon} from '@material-ui/core/'

// ui components
import Chip from '@material-ui/core/Chip';

class RecordStep4 extends Component {


    timerInstance = null;


    constructor(props) {
        super(props);
        this.state = {
            recordTimer: `00:00`,
            audioStr: null,
            audioDuration: 0,
            timeStamps: [],
            audioUrl: null,
            recording: false,
            markers: localStorage.chipData ? JSON.parse(localStorage.chipData) : [],
        };
    }


    componentDidMount() {

        this.timerInstance = new Timer();
        const $this = this;

        this.timerInstance.addEventListener('secondsUpdated', function (e) {

            let timeVal = e.detail.timer.getTimeValues().toString().substring(3);
            let totalDuration = e.detail.timer.getTotalTimeValues().seconds;

            $this.setState({
                ...this.state,
                ...{ recordTimer: timeVal, audioDuration: totalDuration}
            })
        });
    }


    componentWillReceiveProps(props) {

        if (props.record.success) {
            localStorage.removeItem('chipData');
            props.history.push(`/docs/${props.record.data._id}`)
        }
    }


    render() {

        const {recordTimer, audioStr, markers, recording, audioUrl} = this.state;

        return (

            <div className="main-content">

                <div className="row record-step4">

                    <div className="offset-sm-3 col-sm-6">

                        <div className="card text-center single">

                            <div className="beta-tag">Beta</div>

                            <div className="card-header">

                                <label className="step-count">STEP 4 of 4</label>

                                <h2>Record your interview</h2>

                            </div>

                            <div className="card-block">

                                <div className="form-group d-flex justify-content-center mt-3">

                                    <div className="record-sec">

                                        <ReactMic
                                          record={recording}
                                          className='react-mic-addon'
                                          onStop={this.recordingBufferEvent}
                                        />
                                        {
                                            !audioUrl && 
                                            <button className={recording ? 'on-rec' : 'off-rec'} onClick={this.onRecordingChange} type="button">
                                                { !recording && <span> <Icon style={{ lineHeight: '18px', fontSize: 15 }}>fiber_manual_record</Icon> Record </span> }
                                                { recording && <span> <Icon style={{ lineHeight: '25px', fontSize: 18 }}>stop</Icon> Stop </span> }
                                            </button>
                                        }
                                        
                                    </div>

                                    <div className="timer">{recordTimer}</div>
                                </div>

                                <div className="input-group mt-4">

                                    <label>Add a new marker</label>

                                    <input ref="marker" className="form-control" onKeyPress={this.addMarker}
                                           placeholder="Enter text to add a new marker"/>

                                    <span><i className="material-icons">add</i></span>

                                </div>


                                <div className="chip-sec">

                                    {
                                        markers.map(data => {

                                            return (
                                                <Chip label={data.label}
                                                      onDelete={this.deleteMarker(data)}
                                                      onClick={this.onChipClick(data.label)}
                                                      className='chip'/>
                                            );
                                        })
                                    }

                                </div>


                            </div>

                            <button disabled={!audioStr} onClick={this.saveRecord}
                                    className="btn btn-primary">Save my interview
                            </button>

                            <div className="card-footer">

                                <a href="">Skip this step</a>

                            </div>

                        </div>


                    </div>

                </div>

            </div>

        );

    }


    onRecordingChange = () => {

        this.timerInstance.start();
        this.setState({
            ...this.state, ...{recording: !this.state.recording}
        })
    };


    recordingBufferEvent = (AudioRecorderChangeEvent) => {

        console.log(AudioRecorderChangeEvent)

        const fileReader = new FileReader();
        fileReader.readAsDataURL(AudioRecorderChangeEvent.blob);

        fileReader.onload = () => {
            this.setState({
                ...this.state, ...{
                    audioStr: fileReader.result,
                    audioUrl: AudioRecorderChangeEvent.blobURL
                }
            });
            this.timerInstance.stop();
        }
    };


    addMarker = (e) => {


        if (e.key === 'Enter' && this.refs.marker.value !== '') {

            this.state.markers = this.state.markers.filter(r => r.label !== this.refs.marker.value);
            this.state.markers.push({label: this.refs.marker.value});
            this.setState({
                ...this.state,
                ...{markers: this.state.markers}
            });
            this.onChipClick(this.refs.marker.value)();
            this.refs.marker.value = null;
        }


    };


    onChipClick = value => () => {

        //For adding timestamp with the marker
        if (!this.state.recording)
            return;


        this.state.timeStamps.push({
            timeConstraint: this.state.recordTimer,
            label: value
        });

        this.setState({
            ...this.state, ...{
                timeStamps: this.state.timeStamps
            }
        });
    };


    deleteMarker = data => () => {
        this.state.markers.splice(this.state.markers.indexOf(data), 1);
        this.setState(this.state)
    };


    saveRecord = () => {
        this.props.dispatch(saveRecord({
            timeStamps: this.state.timeStamps, audioStr: this.state.audioStr, length: this.state.audioDuration
        }))
    }

}


function mapStateToProps(state) {

    const {records} = state;

    if (records) {
        return records
    }
    return {success: false};
}


export default connect(mapStateToProps)(RecordStep4);