import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getTagCount} from "../../actions/google-drive";
import _ from "underscore";
import WordCloud from "react-d3-cloud";
import moment from "moment";
import "../_styles/synthesisDoc.css";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";

class SynthesisDoc extends Component {
    createMarkup = value => {
        return {__html: value.replace(/\n/g, "<br />")};
    };
    toggleClass = () => {
        this.setState({...this.state, ...{active: !this.state.active}});
    };

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            wordCloudTags: [],
            message: ""
        };
    }

    componentDidMount() {
        const {getTagCount, match, user, records} = this.props,
            driverPathArr = _.findWhere(records, {
                _id: match.params._id
            }).drive_path.split("/");

        getTagCount(
            {file_id: driverPathArr[driverPathArr.length - 1], user_id: user._id},
            response => {
                //console.log('response', response);
                if (response.status) {
                    this.setState({wordCloudTags: response.data || []});
                } else {
                    this.setState({message: response.message});
                }
            }
        );
    }

    render() {
        const fontSizeMapper = word => word.value * 15,
            rotate = word => word.value % 30;
        const customRenderer = (tag, size, color) => {
            return (
                <span key={tag.value} style={{color}} className={`tag-${size}`}>
          {tag.value}
        </span>
            );
        };

        const {user, records, match} = this.props,
            record = _.findWhere(records, {_id: match.params._id}),
            {wordCloudTags, message} = this.state,
            colors = ["pink", "blue", "purple", "red", "white", "cyan"];

        return (
            <div className="main-content">
                <div className="row">
                    <div className="col-sm-10 offset-md-1">
                        <div className="main-title">File Name User Research Synthesis</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-10 col-lg-6 sidearea offset-md-1">
                        <div className="docs-wrapper2">
                            <div className="row">
                                <div className="col-sm-10 sidearea offset-md-1">
                                    {record ? record.title : ""}
                                    <span style={{marginLeft: 25}}>
                    <a href={record ? record.drive_path : "#"} target="_blank">
                      <img
                          src={
                              record && record.type === 2
                                  ? `/images/doc.png`
                                  : `/images/doc-green.png`
                          }
                      />{" "}
                        {record && record.type === 2 ? "BeaconDoc" : "Summary"}
                    </a>
                  </span>
                                </div>

                                <div className="timers">
                                    {record &&
                                    record.markers.map((value, index) => {
                                        return (
                                            <div
                                                className="timeline"
                                                key={index}
                                                style={{marginLeft: 60, marginTop: 20}}
                                            >
                                                <span>{value.timeConstraint}</span>
                                                <span style={{marginLeft: 50}}>
                            <span
                                dangerouslySetInnerHTML={this.createMarkup(
                                    value.label
                                )}
                            />{" "}
                          </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            !this.state.active
                                ? "col-sm-12 col-md-1 col-lg-4 offset-md-0 no-stats"
                                : "col-sm-12 col-md-1 col-lg-4 offset-md-0 state-collapse"
                        }
                    >
            <span onClick={this.toggleClass} className="stats_icon">
              <img src="../../images/tags.png"/>
            </span>
                        <div className="userinfocol">
                            <div className="section-title">Summary</div>

                            <div className="user-info">
                                <div className="imagecol"/>
                                <div className="textcol">
                                    <div className="username">
                                        <span>Created By</span>{" "}
                                        {user && user.name ? user.name.capitalizeEachLetter() : ""}
                                    </div>
                                    <div className="update-date">
                                        {moment(record ? record.updated_at : "").format("LL")}
                                    </div>
                                </div>
                            </div>

                            <div className="action-counts">
                                <div className="row">
                                    <div className="col-md-4 col-sm-4 col-4">
                                        <div className="icon">
                                            <img src="../../images/doc.svg"/>
                                        </div>
                                        <div className="count">
                                            {records.filter(value => value.status === 1).length}
                                        </div>
                                        <div className="type">Docs</div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-4">
                                        <div className="icon">
                                            <img src="../../images/tags.svg"/>
                                        </div>
                                        <div className="count">5</div>
                                        <div className="type">Tags</div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-4">
                                        <div className="icon">
                                            <img src="../../images/moment.png"/>
                                        </div>
                                        <div className="count">12</div>
                                        <div className="type">Moments</div>
                                    </div>
                                </div>
                            </div>

                            <div className="most-used-tags">
                                <div className="col-title">Most frequently used tags</div>
                                <ul className="all-tags">
                                    {!wordCloudTags.length && !message ? (
                                        <CircularProgress size={15} color={"inherit"}/>
                                    ) : !message ? (
                                        ""
                                    ) : (
                                        <span className="error">Tags not found!</span>
                                    )}

                                    {wordCloudTags.length > 0 &&
                                    wordCloudTags
                                        .sort((a, b) => (a.value < b.value ? 1 : -1))
                                        .map((value, index) => {
                                            return (
                                                <li
                                                    className={colors[_.random(0, colors.length - 1)]}
                                                >
                                                    {value.text}
                                                    <span>{value.value}</span>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>

                            <div className="cloud-tags">
                                <div className="col-title">Word Cloud</div>

                                {!wordCloudTags.length && !message ? (
                                    <CircularProgress size={15} color={"inherit"}/>
                                ) : !message ? (
                                    ""
                                ) : (
                                    <span className="error">Word Cloud not found!</span>
                                )}

                                <WordCloud
                                    data={wordCloudTags}
                                    width="300"
                                    height="300"
                                    fontSizeMapper={fontSizeMapper}
                                    rotate={rotate}
                                    shuffle={true}
                                    renderer={customRenderer}
                                    padding={word => word.value * 0.1}
                                    onWordClick={word => console.log(word)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SynthesisDoc.propTypes = {
    user: PropTypes.object.isRequired,
    records: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    records: state.records
});

const mapDispatchToProps = dispatch => ({
    getTagCount: bindActionCreators(getTagCount, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SynthesisDoc);
