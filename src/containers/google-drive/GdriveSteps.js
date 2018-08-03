import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { CircularProgress, Icon } from '@material-ui/core/es/index';
import { googleDocDetail } from '../../actions/google-drive';
import { saveSynthesisDoc } from '../../actions/records';
import gdrive from './../../assets/images/gdrive.jpg';

class GdriveSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: true,
      error: false,
      docId: null
    };
  }

  componentDidMount() {
    const { user, location, googleDocDetail, saveSynthesisDoc } = this.props;

    if (location.state) {
      googleDocDetail(location.state, res => {
        if (res.status) {
          const recordsObj = {
            _id: user._id,
            token: user.token,
            title: res.name,
            drive_path: res.url,
            blob_str: location.state.folder_id
          };
          saveSynthesisDoc(recordsObj, res => {
            if(res.status){
              this.setState({ processing: false, docId: res._id });
            } else{
              this.setState({ processing: false, error: true });
            }
          });
          
        } else {
          this.setState({ processing: false, error: true });
        }
      });
    }
  }
  render() {
    const { processing, error, docId } = this.state;
    return (
      <div className="main-content">
        <div className="row record-step1">
          <div className="offset-sm-3 col-sm-6">
            <div className="card text-center single">
              <div className="back-link">
                <Link to="/google-drive">
                  <i className="fa fa-chevron-left" aria-hidden="true" /> back
                </Link>
              </div>

              <div className="upload-file text-center">GIF</div>
              {processing ? (
                [
                  <div className="card-block" key="first">
                    <p>
                      We are processing your file. You can access it using the link below once it's
                      ready.
                    </p>
                  </div>,
                  <div className="row justify-content-center" key="second">
                    <button className="btn drive-btn">
                      <CircularProgress size={15} color={'inherit'} /> Not stored on drive yet
                    </button>
                  </div>
                ]
              ) : !error ? (
                [
                  <div className="card-block" key="third">
                    <h3> You're all set!</h3>

                    <p>
                      Use the libnk below to access your file. If you have any feedback, questions, or
                      comments send us a note to{' '}
                      <span className="back-link"> hello@experiencebeacon.io </span>
                    </p>
                  </div>,
                  <div className="row justify-content-center" key="fourth">
                    <Link to={`/synthesis-doc/${docId}`} className="btn btn-primary"> Open my file</Link>
                  </div>
                ]
              ) : (
                <div className="card-block">
                  <h3> Something went wrong</h3>
                  <p>
                    We couldn't process your files.{' '}
                    <Link to="/google-drive" className="back-link">
                      {' '}
                      Go back{' '}
                    </Link>{' '}
                    and try again. If you have any feedback, questions, or comments send us a note to{' '}
                    <span className="back-link"> hello@experiencebeacon.io </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GdriveSteps.propTypes = {
  user: PropTypes.object.isRequired,
  googleDocDetail: PropTypes.func.isRequired,
  saveSynthesisDoc: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  googleDocDetail: bindActionCreators(googleDocDetail, dispatch),
  saveSynthesisDoc: bindActionCreators(saveSynthesisDoc, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GdriveSteps);
