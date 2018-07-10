import React from "react";
import GooglePicker from "react-google-picker";
import { google_keys as KEY } from "../constants/app-config";

export default props => {
  return (
    <GooglePicker
      clientId={KEY.CLIENT_ID}
      // developerKey={KEY.DEVELOPER_KEY}
      scope={["https://www.googleapis.com/auth/drive"]}
      onChange={data => console.log("on change:", data)}
      multiselect={true}
      navHidden={true}
      authImmediate={false}
      viewId={"FOLDERS"}
      createPicker={(google, oauthToken) => {
        console.log("google.picker", google);
        const googleViewId = google.picker.ViewId.FOLDERS;
        const docsView = new google.picker.DocsView(googleViewId)
          .setIncludeFolders(true)
          .setMimeTypes("application/vnd.google-apps.folder")
          .setSelectFolderEnabled(true);

        const picker = new window.google.picker.PickerBuilder()
          .addViewGroup(
            new google.picker.ViewGroup(google.picker.ViewId.FOLDERS)
              .addView(docsView)
              .addView(google.picker.ViewId.DOCUMENTS)
              .addView(google.picker.ViewId.SPREADSHEETS)
              .addView(google.picker.ViewId.PRESENTATIONS)
              .addView(google.picker.ViewId.FORMS)
              .addView(google.picker.ViewId.PDFS)
          )
          // .addView(docsView)
          .addView(new google.picker.DocsUploadView())
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setOAuthToken(oauthToken)
          //.setDeveloperKey(KEY.DEVELOPER_KEY)
          .setCallback(data => {
            console.log(data, google.picker.Action);
            switch (data.action) {
              case google.picker.Action.PICKED:
                window.open(data.docs[0].url, "_blank");
                break;
            }
          });
        picker.build().setVisible(true);
      }}
    >
      {props._button()}
      <div className="google" />
    </GooglePicker>
  );
};
