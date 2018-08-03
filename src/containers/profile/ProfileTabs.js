
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ProfileTab from './ProfileTab';
import Language from './Language';
import WordCloud from './WordCloud';

const TabContainer = props => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    backgroundColor: 'transparent'
  },
  flexContainer: {
     backgroundColor: 'transparent'
  }  
});

/**************** main Tabs class *************/ 

class ProfileTabs extends Component {
  constructor(props) {
    super(props);
      this.state = {
        value: 0
      };
  }    
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (      
      <div className={classes.root}>
        <AppBar position="static" color="default" className="tabs_outer">
          <Tabs 
            value={value}
            indicatorColor="primary"
            onChange={this.handleChange}
            classes={{ root: classes.tabsRoot}}
          >
            <Tab label="Profile" />
            <Tab label="Billin" />
            <Tab label="Language" />
            <Tab label="Word Cloud" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer> <ProfileTab /> </TabContainer>}
        {value === 1 && <TabContainer>
           <div className="tab_content"> Billings Tab Here</div>
           </TabContainer>}
        {value === 2 && <TabContainer> <Language /></TabContainer>}
        {value === 3 && <TabContainer> <WordCloud /></TabContainer>}
      </div>       
    );
  }
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

ProfileTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileTabs);