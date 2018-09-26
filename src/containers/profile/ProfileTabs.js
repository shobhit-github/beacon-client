import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import ProfileTab from "./ProfileTab";
import Language from "./Language";
import WordCloud from "./WordCloud";
import Billings from "./Billings";
import ChangePassword from "./ChangePassword";
import { billingDetail } from "../../actions/user";

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
    backgroundColor: theme.palette.background.paper
  },
  tabsRoot: {
    backgroundColor: "transparent"
  },
  flexContainer: {
    backgroundColor: "transparent"
  }
});

/**************** main Tabs class *************/

class ProfileTabs extends Component {
    handleChange = (event, value) => {
        this.setState({value});
    };

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      billingData: null
    };
  }

  componentDidMount() {
    const { user, billingDetail } = this.props;
    billingDetail({ id: user._id, token: user.token }, res => {
      if (res.status) {
        this.setState({ billingData: res.data });
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { value, billingData } = this.state;
    const data = {
      payment: 5000
    };
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className="tabs_outer">
          <Tabs
            value={value}
            indicatorColor="primary"
            onChange={this.handleChange}
            classes={{ root: classes.tabsRoot }}
          >
            <Tab label="Profile" />
            <Tab label="Billing" />
            <Tab label="Change Password" />
            <Tab label="Language" />
            <Tab label="Word Cloud" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            {" "}
            <ProfileTab />{" "}
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            {" "}
            <Billings data={billingData} />{" "}
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer>
            {" "}
            <ChangePassword />
          </TabContainer>
        )}
        {value === 3 && (
          <TabContainer>
            {" "}
            <Language />
          </TabContainer>
        )}
        {value === 4 && (
          <TabContainer>
            {" "}
            <WordCloud />
          </TabContainer>
        )}
      </div>
    );
  }
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

ProfileTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  billingDetail: bindActionCreators(billingDetail, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ProfileTabs));
