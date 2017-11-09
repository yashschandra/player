import React from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';

class DetailsPage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			songName: '',
			songId: '',
			tags: [],
			artists: [],
			tagsLeft: []
		}
		this.addTag=this.addTag.bind(this);
		this.removeTag=this.removeTag.bind(this);
		this.changeName=this.changeName.bind(this);
		this.editSong=this.editSong.bind(this);
		this.removeSong=this.removeSong.bind(this);
	}
	componentDidMount(){
		var self=this;
		var id=self.props.params.songId;
		axios.post('/song/details/', {songId: id}).then(function(response){
			console.log(response);
			if(response.data.status==='OK'){
				self.setState({songName: response.data.songName});
				self.setState({songId: response.data.songId});
				self.setState({tags: response.data.tags});
			}
		});
		axios.post('/song/tagsleft/', {songId: id}).then(function(response){
			console.log(response);
			if(response.data.status==='OK'){
				self.setState({tagsLeft: response.data.tagsLeft});
			}
		});
	}
	addTag(tagLeft,event){
		console.log(tagLeft);
		var self=this;
		var id=self.props.params.songId;
		var tagId=tagLeft.tagId;
		axios.post('/song/addtag/', {songId: id, tagId: tagId}).then(function(response){
			if(response.data.status==='OK'){
				var tags=self.state.tags;
				var tagsLeft=self.state.tagsLeft;
				tags.push(tagLeft);
				tagsLeft.splice(tagsLeft.indexOf(tagLeft),1);
				self.setState({tags: tags});
				self.setState({tagsLeft: tagsLeft});
			}
		});
	}
	removeTag(tag,event){
		console.log(tag);
		var self=this;
		var id=self.props.params.songId;
		var tagId=tag.tagId;
		axios.post('/song/removetag/', {songId: id, tagId: tagId}).then(function(response){
			if(response.data.status==='OK'){
				var tags=self.state.tags;
				var tagsLeft=self.state.tagsLeft;
				tagsLeft.push(tag);
				tags.splice(tags.indexOf(tag),1);
				self.setState({tags: tags});
				self.setState({tagsLeft: tagsLeft});
			}
		});
	}
	editSong(e){
		var self=this;
		axios.post('/song/edit/', {name: this.state.songName, id: self.props.params.songId}).then(function(response){
			if(response.data.status==='OK'){
				
			}
		});
	}
	removeSong(e){
		var self=this;
		axios.post('/song/remove/', {id: self.props.params.songId}).then(function(response){
			if(response.data.status==='OK'){
				browserHistory.replace("/");
			}
		});
	}
	changeName(e){
		this.setState({songName: e.target.value});
	}
	render(){
		return(
			<div className="row">
				<div className="row">
					<div className="col-md-6"><input type="text" ref="songName" className="form form-control" value={this.state.songName} onChange={this.changeName} /></div>
					<div className="col-md-6">
						<button type="type" onClick={this.editSong} className="btn btn-default">Edit</button>&nbsp;
						<button type="type" onClick={this.removeSong} className="btn btn-default">Delete</button>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 scrollDiv">{this.state.tags.map((tag, i)=><Tag onClick={this.removeTag.bind(null,tag)} key={i} data={tag} />)}</div>
					<div className="col-md-6 scrollDiv">{this.state.tagsLeft.map((tagLeft, i)=><Tag onClick={this.addTag.bind(null,tagLeft)} key={i} data={tagLeft} />)}</div>
				</div>
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
			<div className="tag"><button type="button" onClick={this.props.onClick} className="btn btn-default">{this.props.data.tagName}</button></div>
		);
	}
}

export default DetailsPage;
