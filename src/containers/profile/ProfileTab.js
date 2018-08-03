import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core/es/index';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { updateProfile } from '../../actions/user';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
  profile: {}
});

class ProfileTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      role: '',
      company: '',
      email: '',
      password:'',
      update: false,
      showPassword: false,
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
      });
   }  

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  /*************** User Login *************/
  handleSubmit = event => {
    event.preventDefault();
    const { user, updateProfile } = this.props;
    if(this.state.name){ 
    this.setState({update: true});     
    if(!this.state.password){
      delete this.state.password;
    }
      const obj ={
        ...this.state,
        _id: user._id,
        token: user.token
      };
      updateProfile(obj, res => { 
        if(res || !res){
          this.setState({update: false});
        }
      });
    }
  }

  render(){
    const { classes, user } = this.props;
    const { name, email, update, role, company } = this.state;
    return (
      <div className="tab_content">
        <div className="row">
            <div className="col-sm-12 col-md-6 profile-form">

              <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                <TextField
                  id="name"
                  label="Name"
                  required
                  error={!name}
                  className={classes.profile}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Full Name"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e)=>this.setState({name: e.target.value})}
                />

                <TextField
                  id="role"
                  label="Role"
                  className={classes.profile}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="eg. User Researcher"
                  fullWidth
                  margin="normal"
                  onChange={(e)=>this.setState({role: e.target.value})}
                  value={role}
                />

                <TextField
                  id="company"
                  label="Company"
                  className={classes.profile}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Company Name"
                  fullWidth
                  margin="normal"
                  onChange={(e)=>this.setState({company: e.target.value})}
                  value={company}
                />

                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  disabled
                  className={classes.profile}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="example@example.com"
                  fullWidth
                  margin="normal"
                  value={email}
                />
                  <div className="password_option">
                <InputLabel htmlFor="adornment-password" className="label-class">Password</InputLabel>
                  <Input
                    id="pasword"
                    className={classes.profile}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    placeholder="Password"
                    fullWidth
                    onChange={(e)=>this.setState({password: e.target.value})}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
            </div>

                <button disabled={update} type="submit" className="btn btn-primary">
                    {update ? <CircularProgress size={15} color={'inherit'} /> : `Save Changes`}
                    </button>
              </form>
            </div>
              
            <div className="col-sm-12 col-md-5">
              <div className="profile-pic"><span>{name.charAt(0).capitalizeFirstLetter()}</span></div>
               <div className="profile_text">
              <a href="" className="btn btn-primary"><img src="../../images/google.svg"/> Connect a Google account</a>
              <p>Add a Google account to get the most from Beacon<br/> and synthesize your research across docs.</p>
          </div>
            </div>

          </div>
          </div>
      );
  }
}

ProfileTab.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  updateProfile: bindActionCreators(updateProfile, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ProfileTab));

