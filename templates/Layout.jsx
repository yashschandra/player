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
				<div>Layout top</div>
				<div>
					<TopBar />
				</div>
				<div>{this.props.children}</div>
				<div>Layout bottom</div>
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
			<div>
				<Link to="/">home</Link>
				<Link to="/upload">upload</Link>
				<Link to="/tags">tags</Link>
				
			</div>
		);
	}
}

export default Layout;
