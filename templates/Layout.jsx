import React from 'react';
import {Link} from 'react-router';
import axios from 'axios';

class Layout extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div>
				<TopBar />
				{this.props.children}
			</div>
		);
	}
}

class TopBar extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="row">
				<Link to="/"><div className="col-md-4 col-sm-4 text-center panel panel-default"><button type="button" className="btn btn-link">Home</button></div></Link>
				<Link to="/upload"><div className="col-md-4 col-sm-4 text-center panel panel-default"><button type="button" className="btn btn-link">Upload</button></div></Link>
				<Link to="/tags"><div className="col-md-4 col-sm-4 text-center panel panel-default"><button type="button" className="btn btn-link">Tags</button></div></Link>
			</div>
		);
	}
}

export default Layout;
