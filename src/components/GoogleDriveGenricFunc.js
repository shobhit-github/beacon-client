import React from 'react';
import PropTypes from 'prop-types';
import GooglePicker from 'react-google-picker';
import { google_keys as KEY } from '../constants/app-config';

const GoogleDriveGenricFunc = props => {
  return (
    <GooglePicker
      clientId={KEY.CLIENT_ID}
      scope={['https://www.googleapis.com/auth/drive']}
      onChange={data => console.log('on change:', data)}
      multiselect={true}
      navHidden={false}
      authImmediate={false}
      createPicker={(google, oauthToken) => {
        props._getOauthToken(oauthToken);
        const googleViewId = google.picker.ViewId.FOLDERS;
        const docsView = new google.picker.DocsView(googleViewId)
          .setIncludeFolders(true)
          .setMimeTypes('application/vnd.google-apps.folder')
          .setSelectFolderEnabled(true);

        const picker = new window.google.picker.PickerBuilder()
          // .addViewGroup(
          //     new google.picker.ViewGroup(google.picker.ViewId.DOCUMENTS)
          //     .addView(docsView)
          //     .addView(google.picker.ViewId.DOCUMENTS)
          //     .addView(google.picker.ViewId.SPREADSHEETS)
          //     .addView(google.picker.ViewId.PRESENTATIONS)
          //     .addView(google.picker.ViewId.FORMS)
          //     .addView(google.picker.ViewId.PDFS)
          // )
          .addView(docsView)
          .addView(new google.picker.DocsUploadView())
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setOAuthToken(oauthToken)
          .setCallback(data => {
            //console.log(data, google.picker.Action);
            switch (data.action) {
              case google.picker.Action.PICKED:
                props._getDocDetail(data.docs[0].id, data.docs[0].name);
                break;
            }
          });
        picker.build().setVisible(true);
      }}
    >
      {props._button()}
    </GooglePicker>
  );
};

GoogleDriveGenricFunc.propTypes = {
  _getDocDetail: PropTypes.func.isRequired,
  _button: PropTypes.func.isRequired
};

export default GoogleDriveGenricFunc;
