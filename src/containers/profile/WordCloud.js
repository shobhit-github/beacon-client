import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import { CircularProgress } from '@material-ui/core/es/index';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { updateProfile } from '../../actions/user';

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
  chip: {
      color: '#fff',
      backgroundColor: '#20c997',
      marginBottom: theme.spacing.unit * 1
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
});

class WordCloud extends Component {
      constructor(props) {
          super(props);
          this.state = {
            Keyword: '',
            update: false,
            checked: false,
            keywords: []
          };
          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount(){
    this.setState({keywords: this.props.user.keywords});
  }

  handleKeyword = () => {
    if (this.state.Keyword) {
            this.setState({ keywords: [...this.state.keywords, this.state.Keyword]});
    }
      this.setState({ Keyword: '' });
  };

  handleChange = name => event => {
      this.setState({ [name]: event.target.checked });
  };

  deleteTag(index){
      this.state.keywords.splice(index, 1);
      this.setState({...this.state});
  }

  handleSubmit = () => {
      this.setState({update: true});    
      const { user, updateProfile } = this.props;
      const obj ={
        keywords: this.state.keywords,
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
      const { update, keywords } = this.state;
      return (
        <div className="row">
            <div className="col-sm-12 language">  

            <div className="row">
                  <div className="col-sm-12">                        
                         
                              <div className="row">
                              <div className="col-sm-6 pull-left">
                              <p>Weʼve already excluded a list of common words from your word clouds. If youʼd like us to ignore any other words, enter them here.</p>
                                <InputLabel htmlFor="adornment-password" className="label-class">Add a word to list</InputLabel>
                                <Input
                                      id="full-width"
                                      className={classes.profile}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      type="text"
                                      value={this.state.Keyword}
                                      placeholder="Enter keyword"
                                      fullWidth
                                      margin="normal"
                                      onChange={(e)=>this.setState({Keyword: e.target.value})}
                                      endAdornment={
                                        <InputAdornment position="end">
                                          <Icon className={classes.icon} color="action" onClick={this.handleKeyword}>
                                            add_circle
                                          </Icon>
                                        </InputAdornment>
                                      }
                                    />
                                    <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={this.state.jason}
                                              onChange={this.handleChange('jason')}
                                              value="jason"
                                            />
                                          }
                                          label="Use my projectʼs codes to generate the word cloud. This option is best if you want your word cloud to be based on your most frequently used tags, rather than the text you have tagged."
                                        />
                                          
                              </div>
                              <div className="col-sm-6 pull-right">
                                    <p>Stop Word List</p>
                                    <div className="row">
                                          {     
                                                keywords.map( (value, index) => {
                                                      return (
                                                             <div className={(index+1)%2 !== 0 ? "col-sm-4 text-left" : "col-sm-6 text-left"}>
                                                              <Chip label={value} className={classes.chip} onDelete={() => this.deleteTag(index)} />
                                                            </div>
                                                      );
                                                })
                                          }          
                                    </div>
                                                                         
                              </div>
                              </div>
                              <div className="row">
                                          <div className="col-md-6">
                                                   <button disabled={update} type="submit" className="btn btn-primary" onClick={this.handleSubmit}>
                                                    {update ? <CircularProgress size={15} color={'inherit'} /> : `Save Changes`}
                                                  </button>
                                          </div>
                                          <div className="col-md-4">   
                                          <p className="cloud-txt text-right">
                                              <a href=""> Preview </a>
                                           </p>
                                          </div>
                                    </div>
                                 
                        
                  </div>
            </div>            
            
            </div>
        </div>
      );
      }
}

WordCloud.propTypes = {
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
  )(withStyles(styles)(WordCloud));
