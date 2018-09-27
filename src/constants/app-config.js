/**
 * @file: app-config.js
 * @description: It Contain app configuration keys and environment path's.
 * @date: 04.07.2018
 * @author: Jasdeep Singh
 */

export const environment = {
    API_ROOT:
        window.location.protocol === `https:`
            ? `https://stagingsdei.com:4190/`
            : `http://localhost:4190/`,
    LOCAL_API_URL: `localhost:4190`,
    STAGING_API_URL: `stagingsdei.com:4190`,
    THIRD_PARTY_API_URL: `https://7698f1db.ngrok.io` //`http://172.24.1.52:8080`
};

export const google_keys = {
    CLIENT_ID: `1027930501428-99gtt21gilpn117cugdms5qfj6hoh5u1.apps.googleusercontent.com`,
    DEVELOPER_KEY: `AIzaSyBp0_oFgCT3gdKezC-EdT-wheqph0zPE4s`,
    CLIENT_SECRET: `8ZrFbQPEBZ3cfoRJ7A-c2vLh`
};
