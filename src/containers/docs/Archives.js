import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import Pagination from "react-js-pagination";
import { CircularProgress } from "@material-ui/core/es/index";
import Loader from "../../components/ProcessingLoader";
import { getRecord, updateRecordStatus } from "../../actions/records";
import "../_styles/docs.css";

/*********** PAGINATIONS CONFIG ************/
const ITEM_PER_PAGE = 10,
  PAGE_RANGE_SHOW = 10;

class Archives extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      loaderStatus: false,
      isDelete: false,
      isRefresh: false,
      orderBy: true,
      records: props.records
    };
    this.indexOfLastList = 1 * ITEM_PER_PAGE;
    this.indexOfFirstList = this.indexOfLastList - ITEM_PER_PAGE;
  }

  componentWillMount() {
    this.setState({ loaderStatus: true });
    const { getRecord, user } = this.props;
    getRecord({ _id: user._id }, res => {
      if (res) {
        this.setState({ loaderStatus: false, records: this.props.records });
      }
    });
  }

  /************ Active page on change of pagination ***********/
  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    this.indexOfLastList = pageNumber * ITEM_PER_PAGE;
    this.indexOfFirstList = this.indexOfLastList - ITEM_PER_PAGE;
  }

  /****************** update record status ****************/
  updateStatus(_id, status) {
    const { user, updateRecordStatus, history } = this.props;
    if (status === 1) {
      this.setState({ isRefresh: true, _id });
    } else {
      this.setState({ isDelete: true, _id });
    }
    updateRecordStatus({ _id, status, token: user.token }, res => {
      if (res) {
        if (status === 1) {
          history.push("/docs");
        } else {
          this.setState({ isDelete: false, _id: null });
        }
      } else {
        this.setState({ isRefresh: false, isDelete: false, _id: null });
      }
    });
  }

  /************ List of docs **********/
  list() {
    const { user, history } = this.props;
    const { records, isRefresh, isDelete, _id } = this.state;
    return records
      .filter(value => value.status === 2)
      .slice(this.indexOfFirstList, this.indexOfLastList)
      .map((row, index) => (
        <tr key={index}>
          <td
            onClick={() => history.push(`/docs/${row._id}`)}
            style={{ cursor: "pointer" }}
          >
            <span
              dangerouslySetInnerHTML={{ __html: row.title.replace(/\n/g, "") }}
            />
          </td>

          <td
            onClick={() => history.push(`/docs/${row._id}`)}
            style={{ cursor: "pointer" }}
          >
            {moment(row.updated_at).format("LLL")}
          </td>
          <td>
            <Link
              to={
                row.type === 2 || row.type === 1
                  ? `/docs/${row._id}`
                  : `/synthesis-doc/${row._id}`
              }
            >
              <img
                src={
                  row.type === 2 || row.type === 1
                    ? `./images/doc.png`
                    : `./images/doc-green.png`
                }
              />{" "}
              {row.type === 2 || row.type === 1 ? "BeaconDoc" : "Summary"}
            </Link>
          </td>
          <td>
            <Link to={`/docs/${row._id}`}>
              {user && user.name ? user.name.capitalizeEachLetter() : ""}
            </Link>
          </td>
          <td>
            <span className="table_icons">
              <a
                href="javascript:void(0);"
                onClick={e => {
                  e.stopPropagation();
                  this.updateStatus(row._id, 1);
                }}
                disabled={isRefresh && _id === row._id}
              >
                {isRefresh && _id === row._id ? (
                  <CircularProgress size={15} color={"inherit"} />
                ) : (
                  <img
                    src="../../images/refresh.svg"
                    alt=""
                    width="20px"
                    height="20px"
                  />
                )}
              </a>
              <a
                href="javascript:void(0);"
                onClick={e => {
                  e.stopPropagation();
                  this.updateStatus(row._id, 3);
                }}
                disabled={isDelete && _id === row._id}
              >
                {isDelete && _id === row._id ? (
                  <CircularProgress size={15} color={"inherit"} />
                ) : (
                  <img src="../../images/delete.svg" alt="" />
                )}
              </a>
            </span>
          </td>
        </tr>
      ));
  }

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
      this.setState({ records: this.props.records });
    } else {
      let records = this.props.records.filter(value =>
        types.includes(value.type)
      );
      this.setState({ records });
    }
  };

  render() {
    let { records } = this.state;
    records = records.filter(value => value.status === 2);
    return (
      <div style={{ paddingTop: "30px" }} className="main-content">
        <div className="col-sm-12 ">
          <div style={{ marginBottom: "18px" }} className="fillter_section">
            <h2 className="title_tag">Archives</h2>
            <span>
              <a href="javascript:void(0);" className="icon dropdown">
                Sort by{" "}
                <img
                  className="dropToggle"
                  data-toggle="dropdown"
                  src="../../images/sort.png"
                  alt=""
                />
                <ul className="dropdown-menu">
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
                      Last Updated{" "}
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
                  src="../../images/filter.png"
                  alt=""
                />
                <ul className="dropdown-menu">
                  <li>
                    {" "}
                    <span onClick={() => this.filterRecords([])}>All</span>{" "}
                  </li>
                  <li>
                    {" "}
                    <span onClick={() => this.filterRecords([1, 2])}>
                      Beacon Doc
                    </span>{" "}
                  </li>
                  <li>
                    {" "}
                    <span onClick={() => this.filterRecords([3])}>
                      {" "}
                      Summary{" "}
                    </span>{" "}
                  </li>
                </ul>
              </a>
            </span>
          </div>
          <Loader isShowingLoader={this.state.loaderStatus} />
          {records.length ? (
            <div className="table-responsive custom_responsive_table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Last Updated</th>
                    <th>Media length</th>
                    <th>Created by</th>
                    <th> Action </th>
                  </tr>
                </thead>
                <tbody>{this.list()}</tbody>
              </table>
            </div>
          ) : (
            <h4 className="text-center">You haven’t archived any files yet.</h4>
          )}
        </div>
        <Pagination
          innerClass="pagination"
          hideDisabled
          activePage={this.state.activePage}
          itemsCountPerPage={ITEM_PER_PAGE}
          prevPageText={
            <i className="fa fa-chevron-left customIcon" aria-hidden="true" />
          }
          nextPageText={
            <i className="fa fa-chevron-right customIcon" aria-hidden="true" />
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

Archives.propTypes = {
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
)(Archives);
