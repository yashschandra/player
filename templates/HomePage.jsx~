import React from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import PlayButton from './PlayButton.jsx';
import settings from '../settings.js';
import Websocket from 'react-websocket';

class HomePage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			playing: {},
			lyrics: '',
			songs: [],
			relatedSongs: [],
			socketUrl: ''
		}
		this.handleData=this.handleData.bind(this);
	}
	componentWillMount(){
		var url='ws://'+location.hostname+':'+settings.PORT+'/';
		this.setState({socketUrl: url});
	}
	componentDidMount(){
		var self=this;
		axios.post('/song/allsongs/', {}).then(function(response){
			if(response.data.status==='OK'){
				self.setState({songs: response.data.songs});
			}
		});
		axios.post('/song/current/', {}).then(function(response){
			if(response.data.status==='OK'){
				self.setState({playing: response.data.song[0]});
				self.setState({relatedSongs: response.data.related});
			}
		});
	}
	handleData(data){
		let result=JSON.parse(data);
		console.log(result);
		if(result.type==='add'){
			var allSongs=this.state.songs;
			allSongs.push(result.song[0]);
			this.setState({songs: allSongs});
		}
		if(result.type==='play'){
			this.setState({playing: result.song[0]});
		}
		if(result.type==='related'){
			this.setState({relatedSongs: result.data});
		}
	}
	render(){
		return(
			<div className="row">
				<div className="row">
					<Search data={this.state.playing} />
					<ControlButtons />
				</div>
				<div className="row">
					<div id="songs" className="col-md-4 col-sm-4 scrollDiv">
						<h3><i>Songs</i></h3>
						{this.state.songs.map((song, i)=><Song key={i} data={song} />)}
					</div>
					<div id="related" className="col-md-4 col-sm-4 scrollDiv">
						<h3><i>Related</i></h3>
						{this.state.relatedSongs.map((song, i)=><Song key={i} data={song} />)}
					</div>
					<Websocket url={this.state.socketUrl} onMessage={this.handleData} />
				</div>
			</div>
		);
	}
}

class Song extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="row">
				<div className="col-md-6 col-sm-6"><Link to={"/details/"+this.props.data.songId}>{this.props.data.songName}</Link></div>
				<PlayButton data={this.props.data.songId} />
			</div>
		);
	}
}

class Search extends React.Component{
	constructor(props){
		super(props);
		this.state={
			songId: '',
			query: '',
			searchResults: []
		}
		this.handleSearch=this.handleSearch.bind(this);
		this.querySearch=this.querySearch.bind(this);
		this.selectSearch=this.selectSearch.bind(this);
	}
	componentWillReceiveProps(nextProps){
		this.setState({searchResults: []});
		if(nextProps.data.songName!==undefined){
			this.refs.search.value=nextProps.data.songName;
			this.setState({songId: nextProps.data.songId});
		}
	}
	querySearch(){
		var self=this;
		if(this.refs.search.value.trim().length>0){
			axios.post('/song/searchdata/', {search: this.refs.search.value.trim()}).then(function(response){
				if(response.data.status==='OK'){
					console.log(response.data.data);
					if(response.data.data.length>0){
						self.setState({songId: response.data.data[0].songId});
						self.setState({searchResults: response.data.data});
					}
				}
			});
		}
		else{
			self.setState({searchResults: []});
		}
	}
	handleSearch(e){
		this.setState({searchResults: []});
		window.clearTimeout(this.state.query);
		this.setState({query: window.setTimeout(this.querySearch,1500)});
	}
	componentWillUnmount(){
		window.clearTimeout(this.state.query);	
	}
	selectSearch(song){
		this.setState({songId: song.songId, searchResults: []});
		this.refs.search.value=song.songName;
	}
	render(){
		return(
			<div className="col-md-6 col-sm-6">
				<div className="row">
					<div className="col-md-6 col-sm-6"><input type="text" ref="search" onChange={this.handleSearch} className="form-control"/></div>
					<div className="col-md-3 col-sm-3"><Link to={"/details/"+this.state.songId}><button type="button" className="btn btn-default">Details</button></Link></div>
					<PlayButton data={this.state.songId} />
				</div>
				{this.state.searchResults.length>0?(
					<div className="absolute"><div className="row  panel panel-default">
						{this.state.searchResults.map((searchResult, i)=><SearchResult key={i} data={searchResult} selectSearch={this.selectSearch}/>)}
					</div></div>): null}
			</div>
		);
	}
}

class SearchResult extends React.Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	handleClick(e){
		var song=this.props.data;
		this.props.selectSearch(song);
	}
	render(){
		return(
			<div className="col-md-12 col-sm-12" onClick={this.handleClick}>
				{this.props.data.songName}
			</div>
		);
	}
}

class ControlButtons extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="col-md-6 col-sm-6">
				<PauseButton />
				<StopButton />
				<VolumeUpButton />
				<VolumeDownButton />
			</div>
			
		);
	}
}

class PauseButton extends React.Component{
	constructor(props){
		super(props);
		this.pauseSong=this.pauseSong.bind(this);
	}
	pauseSong(e){
		axios.post('/song/pause/', {}).then(function(response){
			if(response.data.status==='OK'){
			
			}
		});
	}
	render(){
		return(
			<div className="col-md-3 col-sm-3">
				<button onClick={this.pauseSong} className="btn btn-default">Pause</button>
			</div>
		);
	}
}

class StopButton extends React.Component{
	constructor(props){
		super(props);
		this.stopSong=this.stopSong.bind(this);
	}
	stopSong(e){
		axios.post('/song/stop/', {}).then(function(response){
			if(response.data.status==='OK'){
			
			}
		});
	}
	render(){
		return(
			<div className="col-md-3 col-sm-3">
				<button onClick={this.stopSong} className="btn btn-default">Stop</button>
			</div>
		);
	}
}

class VolumeUpButton extends React.Component{
	constructor(props){
		super(props);
		this.volumeUp=this.volumeUp.bind(this);
	}
	volumeUp(e){
		axios.post('/song/volumeup/', {}).then(function(response){
			if(response.data.status==='OK'){
			
			}
		});
	}
	render(){
		return(
			<div className="col-md-3 col-sm-3">
				<button onClick={this.volumeUp} className="btn btn-default">Volume Up</button>
			</div>
		);
	}
}

class VolumeDownButton extends React.Component{
	constructor(props){
		super(props);
		this.volumeDown=this.volumeDown.bind(this);
	}
	volumeDown(e){
		axios.post('/song/volumedown/', {}).then(function(response){
			if(response.data.status==='OK'){
			
			}
		});
	}
	render(){
		return(
			<div className="col-md-3 col-sm-3">
				<button onClick={this.volumeDown} className="btn btn-default">Volume Down</button>
			</div>
		);
	}
}

export default HomePage;
