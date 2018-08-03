import React from 'react';
import ProfileTabs from './ProfileTabs';
import '../_styles/profile.css';

export default props => {   
    return (
      <div className="main-content">
      <div className="profile_section">
        <div className="row">
          <div className="col-sm-12"> 
            <ProfileTabs {...props}/>
          </div>         
        </div>
      </div>
      </div>
    );
};


