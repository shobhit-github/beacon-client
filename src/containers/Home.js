import React, { Component } from "react";
import { Link } from "react-router-dom";
import recordImage from "../assets/images/record_interview.png";
import researchImage from "../assets/images/reserch.png";
import GoogleDriveGenricFunc from "../components/GoogleDriveGenricFunc";
import { google_keys as KEY } from "../constants/app-config";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.button = this.button.bind(this);
    this.getOauthToken = this.getOauthToken.bind(this);
  }

  button() {
    return <button className="btn btn-primary">Open your Google Drive</button>;
  }

  getOauthToken(token) {
    if (token) {
      const obj = {
        access_token: token,
        client_id: KEY.CLIENT_ID,
        client_secret: KEY.CLIENT_SECRET,
        refresh_token: "1/uhp-2KXPNUJc1RRYu72e1JPL1Ik33VxUX0LhdU_ehI4",
        token_expiry: "",
        token_uri: "https://accounts.google.com/o/oauth2/token",
        user_agent: "GDrive",
        revoke_uri: "https://accounts.google.com/o/oauth2/revoke",
        id_token: null,
        id_token_jwt: null,
        token_response: {
          access_token: token,
          expires_in: 3600,
          refresh_token: "1/uhp-2KXPNUJc1RRYu72e1JPL1Ik33VxUX0LhdU_ehI4",
          token_type: "Bearer"
        },
        scopes: ["https://www.googleapis.com/auth/drive"],
        token_info_uri: "https://www.googleapis.com/oauth2/v3/tokeninfo",
        invalid: false,
        _class: "OAuth2Credentials",
        _module: "oauth2client.client"
      };
    }
  }

  render() {
    return (
      <div className="main-content">
        <div className="row">
          <div className="offset-sm-1 col-sm-5">
            <div className="card text-center dashboard">
              <div className="card-header">
                <h2>Record an interview</h2>
              </div>
              <div className="card-block">
                <img src={recordImage} alt="Record Interview" />
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry.
                </p>
                <Link to="/records/step_one" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
              <div className="card-footer">
                <a href="">Learn more</a>
              </div>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="card text-center dashboard">
              <div className="card-header">
                <h2>Synthesize my research</h2>
              </div>
              <div className="card-block">
                <img src={researchImage} alt="Research" />
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry.
                </p>
                <GoogleDriveGenricFunc
                  _button={this.button}
                  _getOauthToken={this.getOauthToken}
                />
              </div>
              <div className="card-footer">
                <Link to="">Learn more</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
