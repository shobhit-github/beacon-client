import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import _ from "underscore";
import htmlToDraft from "html-to-draftjs";
import {CircularProgress} from "material-ui";
import draftToHtml from "draftjs-to-html";
import {stateToHTML} from "draft-js-export-html";
import Download from "@axetroy/react-download";
import Loader from "../../components/ProcessingLoader";
import {environment as env} from "../../constants/app-config";
import {
    saveUserDriveDetails,
    googleSaveDoc
} from "../../actions/google-drive";
import GoogleDriveGenricFunc from "../../components/GoogleDriveGenricFunc";
import {
    updateRecord,
    updateRecordStatus,
    getHistory,
    downloadAudio
} from "../../actions/records";
import {google_keys as KEY} from "../../constants/app-config";
import "../_styles/docs.css";
import {Editor} from "react-draft-wysiwyg";
import {
    EditorState,
    convertToRaw,
    ContentState,
    convertFromRaw
} from "draft-js";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PopUpModal from "../../components/PopUpModal";
import $ from "jquery";
import AlertMsg from "../../components/AlertMsg";

var fileDownload = require('js-file-download');


class Docs extends Component {
    editiorContent = val => {
        const contentBlock = htmlToDraft(val);
        let editorState;
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            );
            editorState = EditorState.createWithContent(contentState);
            this.setState({editorState: editorState});
        }
    };
    handleError = error => {
        throw error.message;
    };
    playPauseSong = () => {
        if (this.state.playing) {
            document.getElementById("audio").pause();
            clearInterval(this.state.interval);
            this.state.interval = 0;
            this.state.isPaused = 1;
            this.setState({...this.state});
        } else {
            this.state.isPaused = 0;
            if (this.state.percent >= 100) {
                this.state.percent = 0;
                this.state.sec = 0;
                this.state.isPaused = 0;
                this.setState({...this.state});
            }
            document.getElementById("audio").play();
            this.progressUpdate();
        }
        this.state.playing = !this.state.playing;
        this.setState({...this.state});
    };
    endProgress = () => {
        clearInterval(this.state.interval);
        this.state.sec = 0;
        this.state.interval = 0;
        this.state.percent = 100;
        this.state.playing = 0;
        this.state.isPaused = 1;
        this.setState({...this.state});
    };
    progressUpdate = () => {
        let length = this.state.record.media_length;
        this.state.interval = setInterval(this.updateProgress, 1000);
        this.setState({...this.state});
    };
    updateProgress = () => {
        if (!this.state.isPaused) {
            this.state.sec += 1;
            this.state.percent =
                (this.state.sec / this.state.record.media_length) * 100;
            this.setState({...this.state});
            if (this.state.percent === 100) {
                this.endProgress();
            }
        }
    };
    pointPlayBubble = seconds => {
        let timeArr = seconds.split(":");
        let secs = parseInt(timeArr[0] * 60) + parseInt(timeArr[1]);
        this.skipPlay(secs);
    };
    skipPlay = data => {
        if (data === "forward") {
            data =
                this.state.sec + 10 >= this.state.record.media_length
                    ? this.state.record.media_length
                    : this.state.sec + 10;
        } else if (data === "back") {
            data = this.state.sec - 10 <= 0 ? 0 : this.state.sec - 10;
        }
        this.state.sec = data - 1;
        this.state.percent =
            (this.state.sec / this.state.record.media_length) * 100;
        document.getElementById("audio").currentTime = data;
        document.getElementById("audio").play();
        this.setState({...this.state});

        if (this.state.isPaused) {
            this.state.sec = data;
            this.state.isPaused = 0;
            this.setState({...this.state});
            this.progressUpdate();
        }
    };
    downloadAudioFile = (url) => {

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (this.status == 200) {
                var myBlob = this.response;
                // myBlob is now the blob that the object URL pointed to.
                console.log(myBlob)
            }
        };
        xhr.send();
    }

    /************ Edit records title ***********/
    editTitle = markers => {
        this.setState({loaderStatus: true});
        const noteDescription = this.state.record.notes;
        const title = document.getElementById("title").innerHTML,
            {records, match, updateRecord, user} = this.props,
            recordObj =
                markers || _.findWhere(records, {_id: match.params._id}).markers,
            record = {
                _id: match.params._id,
                token: user.token,
                title,
                notes: noteDescription,
                timeStamps: recordObj
            };
        updateRecord(record, res => {
            if (res || !res) {
                let temp = ``;
                res.data.markers.map(value => {
                    temp += value.timeConstraint + "    " + value.label + "\n";
                });

                this.setState({loaderStatus: false});
                this.setState({titleEdit: false});
                this.setState({title: title, docData: temp});
            }
        });
    };
    /********** Edit tag values *********/
    editTag = index => {
        this.setState({loaderStatus: true});
        const tagValue = document.getElementById(index).innerHTML,
            {records, match, updateRecord, user} = this.props,
            recordObj = _.findWhere(records, {_id: match.params._id});
        recordObj.markers[index].label = tagValue;
        const record = {
            _id: match.params._id,
            token: user.token,
            title: recordObj.title,
            timeStamps: recordObj.markers
        };
        updateRecord(record, res => {
            if (res || !res) {
                this.setState({loaderStatus: false});
                this.setState({tagEdit: null});
            }
        });
    };

    tagEdit = (index, value) => {
        this.setState({tagEdit: index, tagValue: value});
    };

    audioLoaded = () => {
        this.setState({audioLoaded: true});
    };

    createMarkup = value => {
        return {__html: value.replace(/\n/g, "")};
    };

    /********* Handle delete and archive actions **********/
    handleAction = status => {
        const {updateRecordStatus, match, user, history} = this.props,
            obj = {
                _id: match.params._id,
                token: user.token,
                status
            };
        updateRecordStatus(obj, res => {
            if (res) {
                let path = status === 0 ? "/docs" : "/archives";
                history.push(path);
            }
        });
    };

    onClick = data => {
        if (data === "white") {
            this.state.showWhite = !this.state.showWhite;
        } else {
            this.state.showGreen = !this.state.showGreen;
        }
        if (!this.state.showWhite && !this.state.showGreen) {
            this.state.toggleQuickTip = false;
        }
        this.setState({...this.state});
    };
    onEditorStateChange = editorState => {
        this.state.editorContent = [];

        const editorSourceHTML = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );
        this.setState({editorState, ...{dynamicHtml: editorSourceHTML}});

        setTimeout(() => {
            let text = [];
            let content = [];

            this.state.contentState.blocks.forEach(re => {
                if (re.text.trim() !== "") {
                    if (!this.validateTimeStamp(re.text)) {
                        text[text.length - 1] += `\n${re.text}`;
                    } else {
                        text.push(re.text);
                    }
                }
            });

            text.map((v, i) => {
                content.push({
                    timeConstraint: this.state.contentState.entityMap[i].data.title,
                    label: v
                        .replace(this.state.contentState.entityMap[i].data.title, "")
                        .trim()
                });
                return content;
            });
            this.setState({...this.state, ...{editorContent: content}});
        }, 100);
    };
    onContentStateChange = contentState => {
        $("span.del-timeStamp").remove();
        $(".public-DraftStyleDefault-block")
            .find("span.rdw-link-decorator-wrapper")
            .append(`<span class="del-timeStamp">&times;</span>`);

        const getContentState = convertFromRaw(contentState);
        const newContentState = stateToHTML(getContentState);
        this.setState({contentState});
    };
    toggleQuickTip = () =>
        this.setState(prev => {
            return {
                toggleQuickTip: !prev.toggleQuickTip,
                showGreen: !prev.toggleQuickTip || (!prev.showGreen && !prev.showWhite),
                showWhite: !prev.toggleQuickTip || (!prev.showGreen && !prev.showWhite)
            };
        });
    validateTimeStamp = txt =>
        !(
            new RegExp(
                ".*?" +
                "((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)",
                ["i"]
            ).exec(txt) === null
        );

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    addAdditionalMarkers = () => {
        const {sec} = this.state;
        const compDurationMin = Math.trunc(sec / 60);
        const compDurationSec = sec % 60;
        const completedAudioDuration = `${
            compDurationMin < 10 ? "0" + compDurationMin : compDurationMin
            }:${compDurationSec < 10 ? "0" + compDurationSec : compDurationSec}`;

        let timeStamp = completedAudioDuration.split(":");
        timeStamp = parseInt(timeStamp[1]);
        if (timeStamp > 0) {
            let markerData = this.state.record;
            if (markerData) {
                let markers = markerData.markers;
                markerData.markers.push({timeConstraint: completedAudioDuration});
                this.setState({record: markerData});
            }
            let newTimeStamp = `<p><a href="javascript:void(0)">${completedAudioDuration}</a></p>`;
            let dynamicHtml = this.state.dynamicHtml;

            dynamicHtml += newTimeStamp;
            this.setState({dynamicHtml: dynamicHtml});
            this.editiorContent(dynamicHtml);
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            record: {
                markers: []
            },
            playing: false,
            percent: "0",
            sec: 0,
            toggleQuickTip: true,
            isPaused: 1,
            confirmDelete: false,
            duration: 0,
            titleEdit: false,
            title: "",
            editorContent: [],
            tagEdit: null,
            tagValue: "",
            audioLoaded: false,
            loaderStatus: false,
            fileSaving: false,
            showGreen: true,
            showWhite: true,
            dynamicHtml: false,
            editorState: false,
            open: false,
            history: []
        };

        this.getOauthToken = this.getOauthToken.bind(this);
        this.getDocDetail = this.getDocDetail.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount() {
        const {records, match} = this.props,
            record = _.findWhere(records, {_id: match.params._id});
        let temp = ``;
        record.markers.map(value => {
            temp += value.timeConstraint + "    " + value.label + "\n";
        });

        let last = 0;
        this.setState({
            docData: temp
        });
        this.state.record = record;
        this.state.duration = record ? record.media_length : 0;
        this.state.title = record ? record.title : "";
        let array = [],
            header = ""; //'<h2>'+this.state.title+'</h2>';
        var tr,
            finalString = "",
            div,
            table,
            mainDiv = "<div>";
        mainDiv += header;
        this.state.listItems = record
            ? record.markers.map((number, index) => {
                let timeArr = number.timeConstraint.split(":");
                let secs = parseInt(timeArr[0] * 60) + parseInt(timeArr[1]);

                let prog = (secs / record.media_length) * 100;


                if (index === 0) {
                    // prog = prog - 5 / 2;
                } else {
                    let lastTimeArr = record.markers[index - 1].timeConstraint.split(':');
                    let lastSecs =
                        parseInt(lastTimeArr[0] * 60) + parseInt(lastTimeArr[1]);
                    let lastProg = (lastSecs / record.media_length) * 100;
                    prog = prog - lastProg;
                }

                finalString += `<p><a href="javascript:void(0)">${
                    number.timeConstraint
                    }</a> ${number.label}</p>`;

                return (
                    <span
                        key={index}
                        className="bubble"
                        id={"bubble" + index}
                        style={{marginLeft: prog + "%"}}
                        onClick={() => this.skipPlay(secs)}
                    />
                );
            })
            : [];

        // finalString +=  `<p>&nbsp;</p><p>&nbsp;</p><p>${record.notes || ``}</p>`;

        mainDiv += finalString;
        mainDiv += "</div>";
        this.setState({dynamicHtml: mainDiv});
        this.setState(...this.state);

        /************ Load script for google drive **********/
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/platform.js";
        script.async = true;
        document.body.appendChild(script);
    }

    componentDidMount() {
        let _this = this;
        let dynamicHtml;

        this.jQueryUses(_this);

        document.onkeyup = function (e) {
            e.preventDefault();
            e.stopPropagation();

            //e.ctrlKey && (e.which === 106 || e.which === 74)
            if (e.ctrlKey && (e.which === 106 || e.which === 74)) {
                _this.addAdditionalMarkers();
            } else if (e.keyCode === 27) {
                _this.playPauseSong();
            }
        };

        $("#title").bind("keydown", function (event) {
            const code = event.keyCode ? event.keyCode : event.which;
            if (code === 13) {
                //Enter keycode
                event.preventDefault();
                _this.editTitle();
            }
        });

        if (_this.state.dynamicHtml) {
            _this.editiorContent(_this.state.dynamicHtml);
        }
        const {getHistory, match, user} = this.props;
        getHistory({_id: match.params._id, token: user.token}, res => {
            if (res.status) {
                this.setState({history: res.data});
            }
        });
    }

    getOauthToken(token) {
        const {user, saveUserDriveDetails} = this.props;
        if (token) {
            const obj = {
                details: {
                    access_token: token,
                    client_id: KEY.CLIENT_ID,
                    client_secret: KEY.CLIENT_SECRET,
                    refresh_token: token,
                    token_expiry: "",
                    token_uri: "https://accounts.google.com/o/oauth2/token",
                    user_agent: "GDrive",
                    revoke_uri: "https://accounts.google.com/o/oauth2/revoke",
                    id_token: null,
                    id_token_jwt: null,
                    token_response: {
                        access_token: token,
                        expires_in: 3600,
                        refresh_token: token,
                        token_type: "Bearer"
                    },
                    scopes: ["https://www.googleapis.com/auth/drive"],
                    token_info_uri: "https://www.googleapis.com/oauth2/v3/tokeninfo",
                    invalid: false,
                    _class: "OAuth2Credentials",
                    _module: "oauth2client.client"
                },
                user_id: user._id
            };
            saveUserDriveDetails(obj, res => {
            });
        }
    }

    jQueryUses($this) {
        const draftBlock = "div.public-DraftStyleDefault-block";
        const timeBlock = "span.rdw-link-decorator-wrapper";

        let timeValue;

        const settingUpStats = () =>
            $this.setState({
                ...$this.state,
                ...{
                    editorContent: $this.state.editorContent.filter(
                        val => val.timeConstraint !== timeValue
                    )
                }
            });

        setTimeout(() => {
            $(draftBlock)
                .find(timeBlock)
                .append(`<span class="del-timeStamp">&times;</span>`);

            $(document).on("click", timeBlock + " a", function () {
                $this.pointPlayBubble($(this).text());
            });
            $(document).on("mouseover", draftBlock, function () {
                $(this)
                    .find("span.del-timeStamp")
                    .show();
            });
            $(document).on("mouseout", draftBlock, function () {
                $(this)
                    .find("span.del-timeStamp")
                    .hide();
            });
            $(document).on("click", ".del-timeStamp", function () {
                timeValue = $(this)
                    .closest(timeBlock)
                    .find("a")
                    .text();
                $(this)
                    .closest("div[data-block]")
                    .remove();
            });

            $(document).keydown(function (event) {
                event.stopPropagation();
                settingUpStats();

                if (
                    String.fromCharCode(event.which).toLowerCase() === "'" &&
                    event.ctrlKey &&
                    !(event.which === 19)
                ) {
                    $this.skipPlay("forward");
                }

                if (
                    String.fromCharCode(event.which).toLowerCase() === "%" &&
                    event.ctrlKey &&
                    !(event.which === 19)
                ) {
                    $this.skipPlay("back");
                }
                if (
                    !(
                        String.fromCharCode(event.which).toLowerCase() === "s" &&
                        event.ctrlKey
                    ) &&
                    !(event.which === 19)
                ) {
                    return true;
                }
                $this.editTitle($this.state.editorContent);
                event.preventDefault();
                return false;
            });
        }, 50);
    }

    runProgress(e) {
        this.skipPlay(
            Math.round((e.nativeEvent.offsetX / 399) * this.state.record.media_length)
        );
    }

    /************** get docs detail from google *********/
    getDocDetail(folder_id, folder_name) {
        const {user, match, records, googleSaveDoc, updateRecord} = this.props,
            recordObj = _.findWhere(records, {_id: match.params._id});

        if (folder_id && folder_name) {
            this.setState({fileSaving: true});
            const obj = {
                title: this.state.title,
                time_stamps: recordObj.markers,
                user_id: user._id,
                folder_id: folder_id
            };
            googleSaveDoc(obj, res => {
                if (res.status) {
                    const data = {
                        _id: recordObj._id,
                        token: user.token,
                        status: 1,
                        type: 2,
                        drive_path: res.url
                    };
                    updateRecord(data, response => {
                        this.setState({fileSaving: false});
                    });
                } else {
                    this.setState({fileSaving: false});
                }
            });
        }
    }

    render() {
        const {record, confirmDelete, percent, sec, listItems, duration, isPaused, titleEdit, title, fileSaving, toggleQuickTip, showGreen, showWhite, open, history} = this.state;
        const {updateRecordStatus, match, user} = this.props;

        const totalDurationMin = Math.trunc(duration / 60);
        const totalDurationSec = duration % 60;
        const compDurationMin = Math.trunc(sec / 60);
        const compDurationSec = sec % 60;
        const totalAudioDuration = `${
            totalDurationMin < 10 ? "0" + totalDurationMin : totalDurationMin
            }:${totalDurationSec < 10 ? "0" + totalDurationSec : totalDurationSec}`;
        const completedAudioDuration = `${
            compDurationMin < 10 ? "0" + compDurationMin : compDurationMin
            }:${compDurationSec < 10 ? "0" + compDurationSec : compDurationSec}`;

        let TITLE_ICONS = titleEdit ? (
            <React.Fragment>
                <i className="material-icons" onClick={() => this.editTitle()}>
                    save
                </i>
                <i
                    className="material-icons"
                    onClick={() => this.setState({titleEdit: false, title})}
                >
                    cancel
                </i>
            </React.Fragment>
        ) : (
            ""
        );

        const button = () => {
            return (
                <button disabled={fileSaving} className="btn btn-secondary">
                    {fileSaving ? (
                        <CircularProgress size={15} color={"inherit"}/>
                    ) : (
                        `Save`
                    )}
                </button>
            );
        };

        return (
            <div className="main-content">
                <AlertMsg
                    onPress={() =>
                        this.setState({...this.state, ...{confirmDelete: false}})
                    }
                    isShowingModal={confirmDelete}
                    msg={"Are you sure want to delete this document?"}
                    actionConfirmed={() => {
                        updateRecordStatus(
                            {_id: match.params._id, token: user.token, status: 2},
                            res => {
                                if (res) {
                                    this.props.history.push("/docs");
                                }
                            }
                        );
                    }}
                    type={"warning"}
                    status={"warning"}
                />

                <div className="row">
                    <Loader isShowingLoader={this.state.loaderStatus}/>
                    <div
                        style={{
                            flex: `0 0 ${
                                !toggleQuickTip || (!showGreen && !showWhite) ? "82%" : "58%"
                                }`,
                            maxWidth: `${
                                !toggleQuickTip || (!showGreen && !showWhite) ? "82%" : "58%"
                                }`
                        }}
                        className="col-sm-12 col-md-7 col-lg-7 sidearea player-div p_left_50"
                    >
                        <Link to="/docs" className="back">
                            <i className="fa fa-angle-left"> </i>
                        </Link>

                        <div className="player">
                            <div style={{float: "left"}} className="play-icons">
                                <i
                                    className="play_backward"
                                    onClick={() => this.skipPlay("back")}
                                    aria-hidden="true"
                                >
                                    {" "}
                                </i>
                                <i
                                    onClick={this.playPauseSong}
                                    className={`fa fa-${isPaused ? "play" : "pause"} active`}
                                    aria-hidden="true"
                                >
                                    {" "}
                                </i>
                                <i
                                    className="play_forward"
                                    onClick={() => this.skipPlay("forward")}
                                    aria-hidden="true"
                                >
                                    {" "}
                                </i>
                            </div>

                            <audio
                                onLoadedData={this.audioLoaded}
                                id="audio"
                                onEnded={this.endProgress}
                                src={record ? `${env.API_ROOT + record.blob_str}` : ""}
                                style={{display: "none"}}
                            >
                                <source type="audio/webm"/>
                                Your Browser does not support this HTML Tag
                            </audio>

                            <div
                                style={{
                                    width: "calc(100% - 200px)", /* please don't change by the designer side it is part fo the marking functionality*/
                                    marginLeft: "103px",
                                    lineHeight: 0,
                                    marginTop: "18px"
                                }}
                            >
                                {listItems}
                            </div>

                            <div
                                className="progressBar"
                                style={{cursor: "pointer"}}
                                id="pb"
                                onClick={this.runProgress.bind(this)}
                            >
                                <div className="progress" style={{width: `${percent}%`}}>
                                    {" "}
                                </div>

                                <small>
                                    {" "}
                                    {completedAudioDuration}/{totalAudioDuration}{" "}
                                </small>
                            </div>

                            <a
                                target="_blank"
                                download
                                href={`${env.API_ROOT + record.blob_str}`}
                                className="download-icon"
                            >
                                <i aria-hidden="true"> </i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div
                        style={{
                            flex: `0 0 ${
                                !toggleQuickTip || (!showGreen && !showWhite) ? "82%" : "58%"
                                }`,
                            maxWidth: `${ !toggleQuickTip || (!showGreen && !showWhite) ? "82%" : "58%" }`
                        }}
                        className="col-sm-12 col-md-7 col-lg-7 sidearea p_left_50"
                    >
                        <div className="docs-wrapper">
                            {record ? (
                                <React.Fragment>
                                    <h1
                                        contentEditable={`${titleEdit}`}
                                        id="title"
                                        onClick={e => {
                                            this.setState({titleEdit: true});
                                        }}
                                        dangerouslySetInnerHTML={this.createMarkup(title)}
                                        style={{cursor: "pointer", display: "inline"}}
                                    />
                                    <span style={{marginLeft: 15}}>{TITLE_ICONS}</span>
                                </React.Fragment>
                            ) : (
                                <h1>Record not found!</h1>
                            )}

                            <div className="dropdown">
                                <a
                                    href="javascript:void(0);"
                                    className="dropToggle"
                                    data-toggle="dropdown"
                                >
                                    <i className="fa fa-ellipsis-h"> </i>
                                </a>
                                <ul className="dropdown-menu dropdown_sub">
                                    <li>
                                        <Download
                                            file={`${this.state.title}.doc`}
                                            content={`${this.state.title}\n\n\n${
                                                this.state.docData
                                                } `}
                                        >
                                            <a href="javascript:void(0);">Download</a>
                                        </Download>
                                    </li>
                                    <li>
                                        <a
                                            href="javascript:void(0);"
                                            onClick={() =>
                                                this.setState({
                                                    ...this.state,
                                                    ...{confirmDelete: true}
                                                })
                                            }
                                        >
                                            Delete
                                        </a>
                                    </li>
                                    {record &&
                                    record.status !== 2 && (
                                        <li>
                                            <a
                                                href="javascript:void(0);"
                                                onClick={() => this.handleAction(2)}
                                            >
                                                Archive
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="timers">
                                <Editor
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    toolbarHidden={true}
                                    editorState={this.state.editorState}
                                    onEditorStateChange={this.onEditorStateChange}
                                    onContentStateChange={this.onContentStateChange}
                                />
                            </div>

                            <div className="text_notes">
                <textarea
                    placeholder={"Please add notes..."}
                    onChange={e =>
                        this.setState({
                            ...this.state,
                            ...{
                                record: {
                                    ...this.state.record,
                                    ...{notes: e.target.value}
                                }
                            }
                        })
                    }
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                >
                  {record.notes}
                </textarea>
                            </div>

                            <p
                                style={{cursor: "pointer"}}
                                onClick={this.addAdditionalMarkers}
                                className="time_stamp"
                            >
                                <img src="../../images/stemp.svg" alt=""/> insert timestamp
                                <span>
                  {completedAudioDuration}/{totalAudioDuration}
                </span>
                            </p>
                        </div>
                    </div>
                    <div
                        style={{display: !toggleQuickTip ? "none" : "block"}}
                        className="col-sm-10 col-10 col-md-3 col-lg-3 p_rlt_zero"
                    >
                        {showGreen ? (
                            <div className="quicktip greenbg">
                                <a onClick={() => this.onClick("green")} className="close">
                                    x
                                </a>

                                <h4>Quick tips:</h4>
                                <ul>
                                    <li>
                                        -Ctrl+I adds italic formatting and Ctrl+B adds bold
                                        formatting
                                    </li>

                                    <li>
                                        -Press ESC to play/pause, and Ctrl+j to insert the current
                                        timestamp
                                    </li>
                                </ul>
                            </div>
                        ) : null}
                        {showWhite ? (
                            <div className="quicktip">
                                <a onClick={() => this.onClick("white")} className="close">
                                    x
                                </a>
                                <h4>Quick tips:</h4>
                                <ul>
                                    <li>
                                        -Ctrl+I adds italic formatting and Ctrl+B adds bold
                                        formatting
                                    </li>

                                    <li>
                                        -Press ESC to play/pause, and Ctrl+j to insert the current
                                        timestamp
                                    </li>
                                </ul>
                            </div>
                        ) : null}
                    </div>
                    <div className="col-sm-2 col-2 col-md-2 col-lg-2 sharebox">
                        <ul>
                            <li className="clock" onClick={() => this.handleOpen()}>
                                History{" "}
                                <span>
                  {" "}
                                    <i className=""> </i>{" "}
                </span>
                            </li>

                            <li className="google_drive">
                                {" "}
                                Save to Google Drive &nbsp;
                                <GoogleDriveGenricFunc
                                    _button={button}
                                    _getOauthToken={this.getOauthToken}
                                    _getDocDetail={this.getDocDetail}
                                />
                            </li>
                            <li
                                className="tips"
                                onClick={() => {
                                    this.toggleQuickTip();
                                }}
                            >
                                Quick tips{" "}
                                <span>
                  {" "}
                                    <i className=""> </i>{" "}
                </span>
                            </li>
                        </ul>

                        <PopUpModal
                            open={open}
                            data={history}
                            _handleClose={this.handleClose}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

Docs.propTypes = {
    user: PropTypes.object.isRequired,
    records: PropTypes.array.isRequired,
    updateRecord: PropTypes.func.isRequired,
    downloadAudio: PropTypes.func.isRequired,
    updateRecordStatus: PropTypes.func.isRequired,
    saveUserDriveDetails: PropTypes.func.isRequired,
    googleSaveDoc: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    records: state.records
});

const mapDispatchToProps = dispatch => ({
    updateRecord: bindActionCreators(updateRecord, dispatch),
    downloadAudio: bindActionCreators(downloadAudio, dispatch),
    updateRecordStatus: bindActionCreators(updateRecordStatus, dispatch),
    saveUserDriveDetails: bindActionCreators(saveUserDriveDetails, dispatch),
    googleSaveDoc: bindActionCreators(googleSaveDoc, dispatch),
    getHistory: bindActionCreators(getHistory, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Docs);
