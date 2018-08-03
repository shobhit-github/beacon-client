import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { CircularProgress } from '@material-ui/core/es/index';
import { updateProfile } from '../../actions/user';
//https://material-ui.com/demos/text-fields/
const styles = theme => ({
  root: {
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
});

const languages = [
  {
    value: 'english',
    label: 'US English',
  },
  {
    value: 'french',
    label: 'French',
  }
];

class Language extends Component {
	constructor(props) {
    super(props);
    this.state = {
      language: 'english',
      update: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.setState({language: this.props.user.language});
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };
  handleSubmit = event => {
  	event.preventDefault();
    this.setState({update: true});    
    const { user, updateProfile } = this.props;
    const obj ={
        language: this.state.language,
        _id: user._id,
        token: user.token
      };
    updateProfile(obj, res => { 
        if(res || !res){
          this.setState({update: false});
        }
      });
  }
render() {
	const { classes } = this.props;
	const { update } = this.state;
	return (
    <div className="tab_content">
        <div className="row">
            <div className="col-lg-5 col-md-6 offset-md-1 language profile-form">
              <p>Enter the language youʼll use in your interviews and research docs. Weʼll use this setting to enable</p>              
              <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
              	<TextField
    		          select
    		          label="Language Setting"
                  id="full-width"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}                  
    		          className={classNames(classes.margin, classes.textField)}
    		          value={this.state.language}
    		          onChange={this.handleChange('language')}		         
    		       	>
    		       	{languages.map(option => (
    		            <MenuItem key={option.value} value={option.value}>
    		              {option.label}
    		            </MenuItem>
    	          ))}
	             </TextField>

		              <button disabled={update} type="submit" className="btn btn-primary m_top180">
                      {update ? <CircularProgress size={15} color={'inherit'} /> : `Save Changes`}
                  </button>
              </form>
            </div>
        </div>
        </div>
	);
	}
}

Language.propTypes = {
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
  )(withStyles(styles)(Language));