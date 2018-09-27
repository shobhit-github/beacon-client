import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {saveUserDriveDetails} from "../../actions/google-drive";
import GoogleDriveGenricFunc from "../../components/GoogleDriveGenricFunc";
import {google_keys as KEY} from "../../constants/app-config";

//import "../_styles/docs.css";

class GoogleDrive extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.button = this.button.bind(this);
        this.getOauthToken = this.getOauthToken.bind(this);
        this.getDocDetail = this.getDocDetail.bind(this);
        //this.handleLoad = this.handleLoad.bind(this);
    }

    // componentDidMount() {
    //   window.addEventListener('load', this.handleLoad.bind(this));
    //   window.gapi;
    // }

    // handleLoad() {
    //   if (document.getElementById('drive-box')) {
    //     let element = document.getElementById('drive-box').parentElement;
    //     element.click();
    //   }
    // }

    button() {
        return (
            <div className="drive-box" id="drive-box">
                <label style={{cursor: "pointer"}}> Select Google Drive </label>
                <div className="google"/>
            </div>
        );
    }

    /************** get google auth token *********/
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
            console.log("value to be saved >>> ", obj);
            localStorage.googleToken = JSON.stringify(obj);
            saveUserDriveDetails(obj, res => {
                console.log(res, "res");
            });
        }
    }

    /************** get docs detail from google *********/
    getDocDetail(folder_id, folder_name) {
        const {user, history} = this.props;
        history.push("/google-sync", {folder_id, user_id: user._id, folder_name});
    }

    render() {
        return (
            <div className="main-content">
                <div className="row record-step1">
                    <div className="offset-sm-3 col-sm-6">
                        <div className="card text-center single">
                            <div className="back-link">
                                <Link to="/dashboard">
                                    <i className="fa fa-chevron-left" aria-hidden="true"/> back
                                </Link>
                            </div>

                            <div className="card-header">
                                <label className="step-count">STEP 1 of 4</label>

                                <h2>Choose your folder</h2>
                            </div>
                            <div className="card-block">
                                <p>
                                    Select the folder that conatins the documents you want to
                                    summarize
                                </p>

                                <GoogleDriveGenricFunc
                                    _button={this.button}
                                    _getOauthToken={this.getOauthToken}
                                    _getDocDetail={this.getDocDetail}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GoogleDrive.propTypes = {
    user: PropTypes.object.isRequired,
    saveUserDriveDetails: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    saveUserDriveDetails: bindActionCreators(saveUserDriveDetails, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GoogleDrive);
