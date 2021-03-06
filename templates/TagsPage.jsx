import React from 'react';
import axios from 'axios';

class TagsPage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			tags: [],
			tagClick: false,
			clickedTag: {}
		}
		this.addTag=this.addTag.bind(this);
		this.editTag=this.editTag.bind(this);
		this.tagClicked=this.tagClicked.bind(this);
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
	editTag(tag){
		var self=this;
		console.log(tag);
		axios.post('/tag/edit/', {id: tag.tagId, name: tag.tagName}).then(function(response){
			if(response.data.status==='OK'){
				var oldTags=self.state.tags;
				var newTags=[];
				var i;
				for(i=0; i<oldTags.length; i++){
					if(oldTags[i].tagId===tag.tagId){
						oldTags[i].tagName=tag.tagName;
					}
					newTags.push(oldTags[i]);
				}
				self.setState({tags: newTags});
				self.setState({tagClick: !self.state.tagClick});
			}
		});
	}
	tagClicked(tag){
		this.setState({clickedTag: tag});
		this.setState({tagClick: !this.state.tagClick});
	}
	render(){
		return(
			<div className="row">
				<div className="col-md-6 col-sm-6"><input type="text" ref="tag" placeholder="Tag name" className="form-control" /></div>
				<div className="col-md-6 col-sm-6"><button onClick={this.addTag} className="btn btn-default">Add</button></div>
				{this.state.tagClick?<EditTag data={this.state.clickedTag} editTag={this.editTag} />:null}
				<div className="scrollDiv">{this.state.tags.map((tag, i)=><Tag key={i} data={tag} tagClicked={this.tagClicked} />)}</div>
			</div>
		);
	}
}

class Tag extends React.Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	handleClick(e){
		var tag={};
		tag.tagName=this.props.data.tagName;
		tag.tagId=this.props.data.tagId;
		this.props.tagClicked(tag);
	}
	render(){
		return(
			<div className="tag"><button type="button" className="btn btn-default" onClick={(e)=>this.handleClick(e)}>{this.props.data.tagName}</button></div>
		);
	}
}

class EditTag extends React.Component{
	constructor(props){
		super(props);
		this.state={
			tagName: this.props.data.tagName
		}
		this.changeName=this.changeName.bind(this);
		this.handleClick=this.handleClick.bind(this);
	}
	changeName(e){
		this.setState({tagName: e.target.value});
	}
	handleClick(e){
		var tag={};
		tag.tagName=this.refs.tag.value.trim();
		tag.tagId=this.props.data.tagId;
		this.props.editTag(tag);
	}
	render(){
		return(
			<div className="row">
				<div className="col-md-6 col-sm-6"><input type="text" ref="tag" placeholder="Tag name" className="form-control" value={this.state.tagName} onChange={this.changeName} /></div>
				<div className="col-md-6 col-sm-6"><button onClick={(e)=>this.handleClick(e)} className="btn btn-default">Edit</button></div>
			</div>
		);
	}
}

export default TagsPage;
