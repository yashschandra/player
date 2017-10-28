import React from 'react';
import axios from 'axios';

class TagsPage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			tags: []
		}
		this.addTag=this.addTag.bind(this);
	}
	componentDidMount(){
		var self=this;
		axios.post('/tag/alltags/', {}).then(function(response){
			if(response.data.status==='OK'){
				self.setState({tags: response.data.tags});
			}
		});
	}
	addTag(e){
		var self=this;
		const tag=this.refs.tag.value.trim();
		axios.post('/tag/add/', {tagName: tag}).then(function(response){
			if(response.data.status==='OK'){
				self.refs.tag.value='';
				var allTags=self.state.tags;
				allTags.push(response.data.tag[0]);
				self.setState({tags: allTags});
			}
		});
	}
	render(){
		return(
			<div>
				<input type="text" ref="tag" />
				<button onClick={this.addTag}>Add</button>
				{this.state.tags.map((tag, i)=><Tag key={i} data={tag} />)}
			</div>
		);
	}
}

class Tag extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div>{this.props.data.tagName}</div>
		);
	}
}

export default TagsPage;
