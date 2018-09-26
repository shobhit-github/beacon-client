import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core/es/index";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { setPassword } from "../../actions/user";
import { google_keys as KEY } from "../../constants/app-config";
import GooglePicker from "react-google-picker";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  },
  profile: {}
});

class ChangePassword extends Component {
    handleClickShowPassword = () => {
        this.setState(state => ({showPassword: !state.showPassword}));
    };
    clearLocal = () => {
        window.localStorage.googleToken = "";
        this.state.connect = false;
        this.setState(this.state);
    };
    /*************** User Login *************/
    handleSubmit = event => {
        event.preventDefault();
        const {user, setPassword} = this.props;
        if (this.state.name) {
            this.setState({update: true});
            if (!this.state.password) {
                delete this.state.password;
            }
            const obj = {
                password: this.state.password,
                _id: user._id,
                token: user.token
            };

            setPassword(obj, user._id, res => {
                if (res || !res) {
                    this.setState({update: false});
                }
            });
        }
    };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      role: "",
      company: "",
      email: "",
      password: "",
      update: false,
      showPassword: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

    componentDidMount() {
    const { user } = this.props;
    this.setState({
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      connect: window.localStorage.googleToken ? true : false
    });
  }

  getOauthToken(token) {
    const { user } = this.props;
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

      this.state.connect = true;
      this.setState(this.state);

      localStorage.googleToken = JSON.stringify(obj);
    }
  }

  render() {
    const { classes, user } = this.props;
    const { name, email, update, role, company } = this.state;
    return (
      <div className="tab_content">
        <div className="row">
          <div className="col-sm-12 col-md-12 profile-form">
            <form
              className={classes.container}
              noValidate
              autoComplete="off"
              onSubmit={this.handleSubmit}
            >
              <div className="password_option" style={{ marginBottom: 10 }}>
                <InputLabel
                  htmlFor="adornment-password"
                  className="label-class"
                >
                  Change Password
                </InputLabel>
                <Input
                  id="pasword"
                  className={classes.profile}
                  inputlabelprops={{
                    shrink: true
                  }}
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.password}
                  placeholder="Password"
                  fullWidth
                  onChange={e => this.setState({ password: e.target.value })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {this.state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </div>
              <button
                disabled={update}
                type="submit"
                className="btn btn-primary"
              >
                {update ? (
                  <CircularProgress size={15} color={"inherit"} />
                ) : (
                  `Save Changes`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ChangePassword.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  setPassword: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  setPassword: bindActionCreators(setPassword, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChangePassword));
