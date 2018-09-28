import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import moment from "moment";
import Pagination from "react-js-pagination";
import {CircularProgress} from "@material-ui/core/es/index";
import Loader from "../../components/ProcessingLoader";
import {getRecord, updateRecordStatus} from "../../actions/records";
import "../_styles/docs.css";
import Download from "@axetroy/react-download";
import AlertMsg from "../../components/AlertMsg";
import $ from "jquery";

/*********** PAGINATIONS CONFIG ************/
const ITEM_PER_PAGE = 10,
    PAGE_RANGE_SHOW = 10;

class DocsList extends Component {
    sortRecords = fieldBy => {
        if (this.state.orderBy) {
            this.setState({
                ...this.state,
                ...{
                    orderBy: !this.state.orderBy,
                    records: this.state.records.sort(
                        (a, b) => (a[fieldBy] > b[fieldBy] ? 1 : -1)
                    )
                }
            });
        } else {
            this.setState({
                ...this.state,
                ...{
                    orderBy: !this.state.orderBy,
                    records: this.state.records.sort(
                        (a, b) => (a[fieldBy] < b[fieldBy] ? 1 : -1)
                    )
                }
            });
        }
    };
    filterRecords = types => {
        if (types.length === 0) {
            this.setState({records: this.props.records});
        } else {
            let records = this.props.records.filter(value =>
                types.includes(value.type)
            );
            this.setState({records});
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            loaderStatus: false,
            isArchive: false,
            isDelete: false,
            _id: null,
            confirmBox: false,
            deleteConfirmed: false,
            records: props.records,
            orderBy: true
        };
        this.indexOfLastList = ITEM_PER_PAGE;
        this.indexOfFirstList = this.indexOfLastList - ITEM_PER_PAGE;
    }

    componentWillMount() {
        this.setState({loaderStatus: true});
        const {getRecord, user} = this.props;
        getRecord({_id: user._id}, res => {
            if (res) {
                this.setState({
                    ...this.state,
                    ...{loaderStatus: false, records: this.props.records}
                });
            }
        });
    }

    secToHHMMSS = seconds => `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m ${Math.floor((seconds % 3600) % 60)}s`


    /************ Active page on change of pagination ***********/
    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        this.indexOfLastList = pageNumber * ITEM_PER_PAGE;
        this.indexOfFirstList = this.indexOfLastList - ITEM_PER_PAGE;
    }

    /****************** update record status ****************/

    updateStatus(_id, status) {
        const {user, updateRecordStatus, history} = this.props;
        if (status === 2) {
            this.setState({isArchive: false, _id, confirmBox: true});
        } else {
            this.setState({isDelete: true, _id});
        }


        updateRecordStatus({_id, status, token: user.token}, res => {
            if (res) {
                if (status === 2) {
                    history.push("/archives");
                } else {
                    this.setState({isDelete: false, _id: null});
                }
            } else {
                this.setState({isArchive: false, isDelete: false, _id: null});
            }
        });


    }

    /************ List of docs **********/
    list() {
        const {user} = this.props;
        const {records, isArchive, isDelete, _id} = this.state;
        let temp = ``;

        let last = 0;
        return records
            .filter(value => value.status === 1 || value.status === 0)
            .slice(this.indexOfFirstList, this.indexOfLastList)
            .map((row, index) => (
                <tr style={{cursor: "pointer"}} key={index}>
                    {row.markers.map(value => {
                        temp += value.timeConstraint + "    " + value.label + "\n";
                    })}
                    <td
                        onClick={e => {
                            this.props.history.push(
                                row.type === 2 || row.type === 1
                                    ? `/docs/${row._id}`
                                    : `/synthesis-doc/${row._id}`
                            );
                        }}
                    >
            <span
                dangerouslySetInnerHTML={{__html: row.title.replace(/\n/g, "")}}
            />
                        <p className="mob_text_info">
                            <span>{moment(row.updated_at).format("LLL")}</span>
                            <span>1h 7m 18s</span>
                        </p>
                    </td>
                    <td
                        onClick={e => {
                            this.props.history.push(
                                row.type === 2 || row.type === 1
                                    ? `/docs/${row._id}`
                                    : `/synthesis-doc/${row._id}`
                            );
                        }}
                    >
                        {moment(row.updated_at).format("LLL")}
                    </td>
                    <td
                        onClick={e => {
                            this.props.history.push(
                                row.type === 2 || row.type === 1
                                    ? `/docs/${row._id}`
                                    : `/synthesis-doc/${row._id}`
                            );
                        }}
                    >
                        <Link
                            to={
                                row.type === 2 || row.type === 1
                                    ? `/docs/${row._id}`
                                    : `/synthesis-doc/${row._id}`
                            }
                        >

                            {row.type === 2 || row.type === 1 ? "BeaconDoc" : "Summary"}
                        </Link>
                    </td>
                    <td
                        onClick={e => {
                            this.props.history.push(
                                row.type === 2 || row.type === 1
                                    ? `/docs/${row._id}`
                                    : `/synthesis-doc/${row._id}`
                            );
                        }}
                    >
                        {user && user.name ? user.name.capitalizeEachLetter() : ""}
                    </td>
                    <td>{this.secToHHMMSS(row.media_length)}</td>
                    <td>
            <span className="table_icons">


                <a
                    href="javascript:void(0);"
                    onClick={e => {
                        e.stopPropagation();
                        this.updateStatus(row._id, 2);
                    }}
                    disabled={isDelete && _id === row._id}
                >
                {isDelete && _id === row._id ? (
                    <CircularProgress size={15} color={"inherit"}/>
                ) : (
                    <img src="../../images/delete.svg" alt=""/>
                )}
              </a>
            </span>
                    </td>
                </tr>
            ));
    }

    render() {
        let {records, deleteConfirmed, confirmBox} = this.state;
        records = records.filter(value => value.status === 1 || value.status === 0);

        return (
            <div style={{paddingTop: "30px"}} className="main-content">

                {/*<AlertMsg
                    onPress={() => this.setState({...this.state, ...{confirmBox: false}})}
                    isShowingModal={confirmBox}
                    msg={'Are you sure?'}
                    actionConfirmed={() => this.updateStatus()}
                    type={'warning'}
                    status={'warning'}
                />*/}

                <div className="col-sm-12">
                    <div style={{marginBottom: "18px"}} className="fillter_section">
                        <h2 className="title_tag">My Files</h2>
                        <span>
              <a href="javascript:void(0);" className="icon dropdown">
                Sort by{" "}
                  <img
                      className="dropToggle"
                      data-toggle="dropdown"
                      src="../../images/sort1.svg"
                      alt=""
                      width="20px"
                  />
                <ul className="dropdown-menu">
                  <li>Date</li>
                  <li>
                    {" "}
                      <span onClick={() => this.sortRecords("title")}>
                      Title
                    </span>{" "}
                  </li>
                  <li>
                    {" "}
                      <span onClick={() => this.sortRecords("updated_at")}>
                      {" "}
                          Audio length{" "}
                    </span>{" "}
                  </li>
                </ul>
              </a>
              <a
                  href="javascript:void(0);"
                  className="icon dropdown filter_dropdown"
              >
                Filter by{" "}
                  <img
                      className="dropToggle"
                      data-toggle="dropdown"
                      src="../../images/filter1.svg"
                      alt=""
                      width="15px"
                  />
                <ul className="dropdown-menu">

                    <li>
                    {" "}
                        <span onClick={() => this.filterRecords([1, 2])}>
                      <label className="checkbox-wrap">
                        Beacon Doc
                        <input type="checkbox"/>{" "}
                          <span className="checkmark"> </span>
                      </label>
                    </span>{" "}
                  </li>
                  <li>
                    {" "}
                      <span onClick={() => this.filterRecords([3])}>
                      {" "}
                          <label className="checkbox-wrap">
                        Summary <input type="checkbox"/>{" "}
                              <span className="checkmark"> </span>
                      </label>
                    </span>{" "}
                  </li>
                </ul>
              </a>
            </span>
                    </div>
                </div>
                <div className="col-sm-12 p_zero_mob">
                    <Loader isShowingLoader={this.state.loaderStatus}/>
                    {records.length ? (
                        <div className="table-responsive custom_responsive_table">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Last Updated</th>
                                    <th>Type</th>
                                    <th>Created by</th>
                                    <th>Audio length</th>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>{this.list()}</tbody>
                            </table>
                        </div>
                    ) : (
                        <h4 className="text-center">
                            You have't created any file yet.
                            <br/>
                            Add new interview and synthesized
                            <br/>
                            research files here.
                        </h4>
                    )}
                </div>
                <Pagination
                    innerClass="pagination"
                    hideDisabled
                    activePage={this.state.activePage}
                    itemsCountPerPage={ITEM_PER_PAGE}
                    prevPageText={
                        <i className="fa fa-chevron-left customIcon" aria-hidden="true"/>
                    }
                    nextPageText={
                        <i className="fa fa-chevron-right customIcon" aria-hidden="true"/>
                    }
                    totalItemsCount={
                        records.length / ITEM_PER_PAGE > 1 ? records.length : 0
                    }
                    pageRangeDisplayed={PAGE_RANGE_SHOW}
                    onChange={this.handlePageChange.bind(this)}
                />
            </div>
        );
    }
}

DocsList.propTypes = {
    records: PropTypes.array.isRequired,
    getRecord: PropTypes.func.isRequired,
    updateRecordStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    records: state.records
});

const mapDispatchToProps = dispatch => ({
    getRecord: bindActionCreators(getRecord, dispatch),
    updateRecordStatus: bindActionCreators(updateRecordStatus, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DocsList);
