import React, {Component} from "react";
import {connect} from "react-redux";
import {getRecord} from "../actions/records";

import {environment as env} from "../conf/environment";

class Docs extends Component {

    constructor(props) {

        super(props);

        this.state = {
            record: {
                markers: []
            },
            playing:false,
            percent:"0",
            sec:0,
            isPaused: 1,
            duration: 0
        };
        this.setState(...this.state);
    }


    componentDidMount() {

        this.props.dispatch(getRecord(this.props.match.params.id));
    }


    componentWillReceiveProps(nextProps, props) {

        if (nextProps !== props) {

            let last = 0;

            this.state.record = nextProps.record;
            this.state.duration = nextProps.record.media_length;

            this.state.listItems = nextProps.record.markers.map((number,index) => {

                    let timeArr = number.timeConstraint.split(':');
                    let secs = parseInt(timeArr[0]*60) + parseInt(timeArr[1]);
                    let prog = (secs/nextProps.record.media_length)*100;

                    if(index > 0){
                        let lastTimeArr = nextProps.record.markers[index-1].timeConstraint.split(":");
                        let lastSecs=(lastTimeArr[0]*60)+lastTimeArr[1];
                        let lastProg=(lastSecs/nextProps.record.media_length)*100;
                        prog=prog-lastProg;
                    }

                    return <span className='bubble' style={{marginLeft: prog+"%"}} onClick={this.skipPlay(secs)}> </span>;
                }
            );
            this.setState(...this.state);
        }
    }


    render() {

        const {record, percent, sec, listItems, duration, isPaused} = this.state;

        const totalDurationMin = (Math.trunc(duration / 60));
        const totalDurationSec = (duration % 60);
        const compDurationMin = (Math.trunc(sec / 60));
        const compDurationSec = (sec % 60);

        const totalAudioDuration = `${(totalDurationMin < 9) ? '0' + totalDurationMin : totalDurationMin}:${(totalDurationSec < 9) ? '0' + totalDurationSec : totalDurationSec}`;
        const completedAudioDuration = `${(compDurationMin < 9) ? '0' + compDurationMin : compDurationMin}:${(compDurationSec < 9) ? '0' + compDurationSec : compDurationSec}`;


        return (

            <div className="main-content">

                <div className="row">

                    <div className="col-sm-7 sidearea player-div">

                        <div className="back">

                            <a href=""><i className="fa fa-angle-left"> </i></a>

                        </div>

                        <div className="player">

                            <div style={{float: "left"}} className="play-icons">
                                <i className="fa fa-step-backward" aria-hidden="true"> </i>
                                <i onClick={this.playPauseSong} className={`fa fa-${isPaused ? 'play' : 'pause'} active`} aria-hidden="true"> </i>
                                <i className="fa fa-step-forward" aria-hidden="true"> </i>
                            </div>

                            <audio id="audio" onEnded={this.endProgress} src={`${ env.API_ROOT + record.blob_str}`} style={{display: "none"}}>

                                <source type="audio/webm"/>

                                Your Browser does not support this HTML Tag

                            </audio>

                            <div style={{width: "calc(100% - 160px)", marginLeft: "103px", lineHeight: 0, marginTop: "13px"}}>{listItems}</div>

                            <div className="progressBar">

                                <div className="progress" style={{width: `${percent}%`}}> </div>

                                <small> {completedAudioDuration}/{totalAudioDuration} </small>


                            </div>

                            <a href={`${ env.API_ROOT + record.blob_str}`} download className="download-icon">

                                <i className="fa fa-download" aria-hidden="true"> </i>

                            </a>

                        </div>

                    </div>

                </div>

                <div className="row">

                    <div className="col-sm-7 sidearea">

                        <div className="docs-wrapper">

                            <h1>Untitled Document</h1>

                            <a href="" className="dropToggle"><i className="fa fa-ellipsis-h"> </i></a>

                            <div className="timers">

                                {
                                    // console.log(record.markers)
                                    record.markers.map((value, index) => {
                                        return (
                                            <div className="timeline">
                                                <span>{value.timeConstraint}</span>{value.label}
                                            </div>
                                        )
                                    })
                                }

                            </div>

                        </div>

                    </div>

                    <div className="col-sm-3">

                        <div className="quicktip greenbg">

                            <a href="" className="close">x</a>

                            <h4>Quick tips:</h4>

                            <ul>

                                <li>-Ctrl+I adds italic formatting and Ctrl+B adds bold formatting</li>

                                <li>-Press ESC to play/pause, and Ctrl+j to insert the current timestamp</li>

                            </ul>

                        </div>

                        <div className="quicktip">

                            <a href="" className="close">x</a>

                            <h4>Quick tips:</h4>

                            <ul>

                                <li>-Ctrl+I adds italic formatting and Ctrl+B adds bold formatting</li>

                                <li>-Press ESC to play/pause, and Ctrl+j to insert the current timestamp</li>

                            </ul>

                        </div>

                    </div>

                    <div className="col-sm-2 sharebox">

                        <ul>

                            <li>History <span> <i className=""> </i> </span></li>

                            <li> Save to Google Drive

                                <span>
                                </span>

                            </li>

                            <li>Quick tips <span> <i className=""> </i> </span></li>

                        </ul>

                    </div>

                </div>

            </div>

        );

    }


    handleError = (error) => {
        throw (error.message)
    };

    playPauseSong = () => {
        if(this.state.playing){
            document.getElementById("audio").pause();
            clearInterval(this.state.interval);
            this.state.interval=0;
            this.state.isPaused=1;
            this.setState({...this.state});
        }else{
            this.state.isPaused=0;
            if(this.state.percent>=100){
                this.state.percent=0;
                this.state.sec=0;
                this.state.isPaused=0;
                this.setState({...this.state});
            }
            document.getElementById("audio").play();
            this.progressUpdate();
        }
        this.state.playing=!this.state.playing;
        this.setState({...this.state});

    }

    endProgress = () => {
        clearInterval(this.state.interval);
        this.state.sec=0;
        this.state.interval=0;
        this.state.percent=100;
        this.state.playing=0;
        this.state.isPaused=1;
        this.setState({...this.state});
    }

    progressUpdate(){
        let length = this.state.record.media_length;
        this.state.interval = setInterval(this.updateProgress,1000);
        this.setState({...this.state});
    }

    updateProgress = () => {
        if(!this.state.isPaused){
            this.state.sec+=1;
            this.state.percent=((this.state.sec/this.state.record.media_length)*100);
            this.setState({...this.state});
        }
    };

    skipPlay = data => () => {


        this.state.sec = data-1;
        this.state.percent=((this.state.sec/this.state.record.media_length)*100);
        document.getElementById("audio").currentTime = data;
        document.getElementById("audio").play();
        this.setState({...this.state});

        if(this.state.isPaused) {
            this.state.sec=data;
            this.state.isPaused = 0;
            this.setState({...this.state});
            this.progressUpdate();
        }
    }
}

function mapStateToProps(state) {

    const {records} = state;

    if (records) {
        return records
    }
    return {success: false};
}

export default connect(mapStateToProps)(Docs);
