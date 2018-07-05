import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class DocsList extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentWillMount() {

    }
    /************ List of docs **********/
    list(){
    	return this.props.records.map( (row, index) => 
    		<tr key={index}>
		        <td className="check">
		          #
		        </td>
		        <td>
		          Untitled
		        </td>
		        <td>
		          {row.updated_at}
		        </td>
		        <td>
		          <img src="./images/doc.png"/>  {row.blob_str}
		        </td>
		        <td>
		          Dummy name
		        </td>
		        <td> 
		           <Link to={`/docs/${row._id}`}>View Detail</Link>
		        </td>
		     </tr>	 		
    	)
    }
    render(){
	return(
		<div className="main-content">
            <div className="row">
              <div className="col-sm-12">
				<table className="table">
			    <thead>
			      <tr>
			        <th></th>
			        <th>Title</th>
			        <th>Last Updated</th>
			        <th>Media</th>
			        <th>Created by</th>
			        <th></th>
			      </tr>
			    </thead>
			    <tbody>
			      {this.list()}      
			    </tbody>
	  			</table>
			    </div>
	        </div>
	    </div>
		);
	}
}

DocsList.propTypes = {
    records: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  records: state.records    
});

export default connect(mapStateToProps)(DocsList);