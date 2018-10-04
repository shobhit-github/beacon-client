import React, {Component} from "react";
import PropTypes from "prop-types";
import {ReactMic} from "react-mic";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Timer from "../../../node_modules/easytimer.js/dist/easytimer";
import {saveRecord} from "../../actions/records";
import {Icon} from "@material-ui/core/";
import Chip from "@material-ui/core/Chip";
import {CircularProgress} from "@material-ui/core/es/index";
import AlertMsg from "../../components/AlertMsg";


class RecordStep4 extends Component {


    onRecordingChange = () => {

        this.setState({...this.state, ...{recording: !this.state.recording}});

        setTimeout(() => {
            if (this.state.recording) {
                this.timerInstance.start();
                return window.addEventListener('beforeunload', ($event) => $event.returnValue = `You have attempted to leave this page. Are you sure?`);
            }
            this.timerInstance.stop();
        }, 10)

    };


    recordingBufferEvent = AudioRecorderChangeEvent => {

        const fileReader = new FileReader();
        fileReader.readAsDataURL(AudioRecorderChangeEvent.blob);

        fileReader.onload = () => {
            this.setState({
                ...this.state,
                ...{
                    audioStr: fileReader.result,
                    audioBlob: AudioRecorderChangeEvent.blob,
                    audioUrl: AudioRecorderChangeEvent.blobURL
                }
            });
            this.timerInstance.stop();
        };
    };


    addMarker = e => {
        if (e.key === "Enter" && this.refs.marker.value !== "") {
            this.state.markers = this.state.markers.filter(
                r => r.label !== this.refs.marker.value
            );
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
        if (!this.state.recording) return;

        this.state.timeStamps.push({timeConstraint: this.state.recordTimer, label: value});

        this.setState({
            ...this.state,
            ...{
                timeStamps: this.state.timeStamps
            }
        });
    };


    deleteMarker = data => () => {
        this.state.markers.splice(this.state.markers.indexOf(data), 1);
        this.setState(this.state);
    };


    saveRecord = () => {
        const params = new FormData();

        params.append("_id", this.props.user._id);
        params.append("token", this.props.user.token);
        params.append("timeStamps", JSON.stringify(this.state.timeStamps));
        params.append("audioBlob", this.state.audioBlob);
        params.append("length", this.state.audioDuration);

        const context = this;
        context.setState({interviewSave: true});
        this.props.saveRecord(params, res => {
            if (res.status) {
                this.props.history.push(`/docs/${res._id}`);
            } else {
                context.setState({
                    open: true,
                    msg: res.message,
                    msgType: res.type,
                    msgStatus: res.status,
                    interviewSave: false
                });
            }
        });
    };


    constructor(props) {
        super(props);
        this.state = {
            recordTimer: `00:00`,
            audioStr: null,
            audioBlob: {},
            audioDuration: 0,
            timeStamps: [],
            audioUrl: null,
            micPermission: false,
            confirmBox: false,
            recording: false,
            open: false,
            markers: localStorage.chipData ? JSON.parse(localStorage.chipData) : [],
            interviewSave: false
        };
        this.timerInstance = null;
        this.recordingBufferEvent = this.recordingBufferEvent.bind(this);
    }


    componentDidMount() {

        this.timerInstance = new Timer();
        const $this = this;

        navigator.mediaDevices.getUserMedia({audio: true})
            .then(function (stream) {
                console.log('adfhsdilfh')
                $this.setState({...$this.state, ...{micPermission: true}});
            })
            .catch(function (err) {
                $this.setState({...$this.state, ...{micPermission: false}});
            });


        this.timerInstance.addEventListener("secondsUpdated", e => {
            let timeVal = e.detail.timer
                .getTimeValues().toString().substring(3);
            let totalDuration = e.detail.timer.getTotalTimeValues().seconds;

            this.setState({...this.state, ...{recordTimer: timeVal, audioDuration: totalDuration}});
        });
    }


    componentWillUnmount() {
        localStorage.removeItem("chipData");

    }


    render() {
        const context = this;
        const {recordTimer, audioStr, markers, recording, audioUrl, micPermission, interviewSave, confirmBox} = this.state;

        return (
            <div className="main-content">

                <div className="row record-step4">

                    <AlertMsg
                        onPress={() => this.setState({...this.state, ...{confirmBox: false}})}
                        isShowingModal={confirmBox}
                        msg={'Are you sure want to exit the recording?'}
                        actionConfirmed={() => {
                            this.timerInstance.reset();
                            this.setState({
                                recordTimer: `00:00`,
                                audioStr: null,
                                audioBlob: {},
                                audioDuration: 0,
                                timeStamps: [],
                                audioUrl: null,
                                micPermission: false,
                                confirmBox: false,
                                recording: false,
                                open: false,
                                markers: [],
                                interviewSave: false
                            });
                            setTimeout(() => {
                                this.props.history.push('/dashboard')
                            }, 10)

                        }}
                        type={'warning'}
                        status={'warning'}
                    />

                    <div className="step_section">
                        <div className="card text-center single">
                            <div className="beta-tag">Beta</div>

                            <div className="card-header">
                                <label className="step-count">STEP 4 of 4</label>
                                <h2>Record your session</h2>
                            </div>

                            <div className="card-block">
                                <div className="form-group d-flex justify-content-center mt-3">
                                    <div className="recording_options">

                                        <button type="button" onClick={() => {
                                            if (recording) {
                                                this.setState({...this.state, ...{confirmBox: true}})
                                            }
                                        }} className="cancel_btn"></button>

                                        <div className="record-sec">

                                            <ReactMic
                                                record={recording}
                                                className="react-mic-addon"
                                                onStop={this.recordingBufferEvent}
                                            />
                                            {console.log(audioUrl, micPermission)}
                                            {!audioUrl && micPermission && (
                                                <button
                                                    className={recording ? "off-rec" : "on-rec"}
                                                    onClick={() => this.onRecordingChange()}
                                                    type="button"
                                                >
                                                    {!recording && (
                                                        <span> {" "}
                                                            <Icon> </Icon>{" "}
                                                    </span>
                                                    )}
                                                    {recording && (
                                                        <span>
                                                        {" "}
                                                            <Icon> </Icon>{" "}
                                                    </span>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <button disabled={audioStr == null || interviewSave}
                                                onClick={() => this.saveRecord()} className="save_btn">
                                        </button>

                                    </div>

                                    <div className="timer">
                                        {interviewSave ? (
                                            <CircularProgress size={15} color={"inherit"}/>
                                        ) : (
                                            recordTimer
                                        )}

                                    </div>
                                </div>

                                <div className="input-group mt-4">
                                    <input
                                        ref="marker"
                                        className="form-control"
                                        onKeyPress={this.addMarker}
                                        placeholder="Enter text to add a new marker"
                                    />

                                    <span>
                    <i className="material-icons">add</i>
                  </span>
                                </div>

                                <div className="chip-sec">
                                    {markers.map((data, index) => {
                                        return (
                                            <Chip
                                                key={index}
                                                label={data.label}
                                                onDelete={this.deleteMarker(data)}
                                                onClick={this.onChipClick(data.label)}
                                                className="chip"
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="notes_section">
                                <label>Take notes below</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Enter notes here"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
            ;
    }
}

RecordStep4.propTypes = {
    user: PropTypes.object.isRequired,
    saveRecord: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    saveRecord: bindActionCreators(saveRecord, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordStep4);
