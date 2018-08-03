import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import { CircularProgress } from '@material-ui/core/es/index';
import Loader from '../../components/ProcessingLoader';
import { getRecord, updateRecordStatus } from '../../actions/records';
import '../_styles/docs.css';

/*********** PAGINATIONS CONFIG ************/
const ITEM_PER_PAGE = 10,
  PAGE_RANGE_SHOW = 10;

class DocsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      loaderStatus: false,
      isArchive: false,
      isDelete: false,
      _id: null
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

  /****************** update record status ****************/

  updateStatus(_id, status){
    const {user, updateRecordStatus, history} = this.props;
    if(status ===2){
      this.setState({isArchive: true, _id});
    } else{
      this.setState({isDelete: true, _id});
    }
    updateRecordStatus({_id, status, token: user.token}, res => {
      if(res){
        if(status === 2){
          history.push('/archives');
        } else{
          this.setState({isDelete: false, _id: null});
        }        
      } else{
        this.setState({isArchive: false, isDelete: false, _id: null});
      }
    });
  }

  /************ List of docs **********/
  list() {
    const { records, user } = this.props;
    const { isArchive, isDelete, _id } = this.state;
    return records
      .filter(value => value.status === 1 || value.status === 0)
      .slice(this.indexOfFirstList, this.indexOfLastList)
      .map((row, index) => (
        <tr key={index}>
          {/* <td
            dangerouslySetInnerHTML={{
              __html: row.title.replace(/\n/g, '<br />')
            }}
          >  */}
          <td>  
            <span>
              <em className="checkbox_edit"><input type="checkbox"/></em>
              {row.title.replace(/\n/g, '<br />')}
            </span>
            <div className="tablet_view_content">
              <span>15 Dec 2017</span>
              <span>Laura Smith</span>
            </div>
          </td>
          <td>{moment(row.updated_at).format('LLL')}</td>
          <td>
            <Link to={row.type === 2 || row.type === 1 ? `/docs/${row._id}` : `/synthesis-doc/${row._id}`}>
              <img src={row.type === 2 || row.type === 1? `./images/doc.png` : `./images/doc-green.png`} />{' '}
              {row.type === 2  || row.type === 1 ? 'BeaconDoc' : 'Summary'}
            </Link>
          </td>
          <td>{user.name.capitalizeEachLetter()}</td>
          <td> 
          <span className="table_icons">
           <a href="javascript:void(0);" onClick={() => this.updateStatus(row._id, 2)} disabled={isArchive && _id === row._id}>
           {isArchive && _id === row._id ? <CircularProgress size={15} color={'inherit'} /> : ''}             
           <img src="../../images/download.svg" alt=""/></a>  
            <a href="javascript:void(0);" onClick={() => this.updateStatus(row._id, 3)} disabled={isDelete && _id === row._id}> 
             {isDelete && _id === row._id ? <CircularProgress size={15} color={'inherit'} /> : ''} 
             <img src="../../images/delete.svg" alt=""/></a> 
             </span> 
            </td>
          <td>
           <Link to={row.type === 2 || row.type === 1 ? `/docs/${row._id}` : `/synthesis-doc/${row._id}`}> <img src="../../images/menu_light.svg" alt=""/></Link>
          </td>
        </tr>
      ));
  }

  render() {
    let { records } = this.props;
    records = records.filter(value => value.status === 1 || value.status === 0);
    return (
      <div className="main-content">
          <div className="col-sm-12">

          <div class="fillter_section">
            <h2 className="title_tag">My Files</h2>
            <span><a href="javascript:void(0);" className="icon" >Sort by  <img src="../../images/sort.png" alt=""/></a>
            <a href="javascript:void(0);" className="icon" >Filter by  <img src="../../images/filter.png" alt=""/></a>
            {/* <a href="javascript:void(0);" className="icon" ><img src="../../images/bulk.png" alt=""/></a> */}
            </span>
            
          </div>
          </div>
          <div className="col-sm-12 p_zero_mob">
            <Loader isShowingLoader={this.state.loaderStatus} />
            {records.length ? (
               
              <div className="table-responsive custom_responsive_table">
                {/* use  className="edit_info" in span for show the checkbox icon */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Last Updated</th>
                    <th>Type</th>
                    <th>Created by</th>
                    <th>Action</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{this.list()}</tbody>
              </table>
              </div>
            ) : (
              <h4 className="text-center">
                You have't created any file yet.<br />Add new interview and synthesized<br />research
                files here.
              </h4>
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
