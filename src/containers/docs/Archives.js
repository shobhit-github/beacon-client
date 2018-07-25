import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import Loader from '../../components/ProcessingLoader';
import { getRecord } from '../../actions/records';
import '../_styles/docs.css';

/*********** PAGINATIONS CONFIG ************/
const ITEM_PER_PAGE = 10,
  PAGE_RANGE_SHOW = 10;

class Archives extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      loaderStatus: false
    };
    this.indexOfLastList = 1 * ITEM_PER_PAGE;
    this.indexOfFirstList = this.indexOfLastList - ITEM_PER_PAGE;
  }

  componentWillMount() {
    this.setState({ loaderStatus: true });
    const { getRecord, user } = this.props;
    getRecord({ _id: user._id }, res => {
      if (res) {
        this.setState({ loaderStatus: false });
      }
    });
  }

  /************ Active page on change of pagination ***********/
  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    this.indexOfLastList = pageNumber * ITEM_PER_PAGE;
    this.indexOfFirstList = this.indexOfLastList - ITEM_PER_PAGE;
  }

  /************ List of docs **********/
  list() {
    const { records, user } = this.props;
    return records
      .filter(value => value.status === 2)
      .slice(this.indexOfFirstList, this.indexOfLastList)
      .map((row, index) => (
        <tr key={index}>
          <td className="check">
            <span className="float-left form-link-text" />
          </td>
          <td
            dangerouslySetInnerHTML={{
              __html: row.title.replace(/\n/g, '<br />')
            }}
          />
          <td>{moment(row.updated_at).format('LLL')}</td>
          <td>
            <img src="./images/doc.png" /> {row.media_length} sec.
          </td>
          <td>{user.name.capitalizeEachLetter()}</td>
          <td>
            <Link to={`/docs/${row._id}`}>View Detail</Link>
          </td>
        </tr>
      ));
  }

  render() {
    let { records } = this.props;
    records = records.filter(value => value.status === 2);
    return (
      <div className="main-content">
        <div className="row">
          <div className="col-sm-12">
            <Loader isShowingLoader={this.state.loaderStatus} />
            {records.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th />
                    <th>Title</th>
                    <th>Last Updated</th>
                    <th>Media length</th>
                    <th>Created by</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{this.list()}</tbody>
              </table>
            ) : (
              <h4 className="text-center">You have't any archive file yet.</h4>
            )}
          </div>
          <Pagination
            innerClass="pagination"
            hideDisabled
            activePage={this.state.activePage}
            itemsCountPerPage={ITEM_PER_PAGE}
            prevPageText={<i className="fa fa-chevron-left customIcon" aria-hidden="true" />}
            nextPageText={<i className="fa fa-chevron-right customIcon" aria-hidden="true" />}
            totalItemsCount={records.length / ITEM_PER_PAGE > 1 ? records.length : 0}
            pageRangeDisplayed={PAGE_RANGE_SHOW}
            onChange={this.handlePageChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}

Archives.propTypes = {
  records: PropTypes.array.isRequired,
  getRecord: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  records: state.records
});

const mapDispatchToProps = dispatch => ({
  getRecord: bindActionCreators(getRecord, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Archives);
