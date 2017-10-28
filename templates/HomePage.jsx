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
			<div>
				<Search data={this.state.playing} />
				<ControlButtons />
				Songs
				{this.state.songs.map((song, i)=><Song key={i} data={song} />)}
				Related
				{this.state.relatedSongs.map((song, i)=><Song key={i} data={song} />)}
				<Websocket url={this.state.socketUrl} onMessage={this.handleData} />
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
			<div>
				<Link to={"/details/"+this.props.data.songId}>{this.props.data.songName}</Link><PlayButton data={this.props.data.songId} />
			</div>
		);
	}
}

class Search extends React.Component{
	constructor(props){
		super(props);
		this.state={
			songId: '',
			query: ''
		}
		this.handleSearch=this.handleSearch.bind(this);
		this.querySearch=this.querySearch.bind(this);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.data.songName!==undefined){
			this.refs.search.value=nextProps.data.songName;
			this.setState({songId: nextProps.data.songId});
		}
	}
	querySearch(){
		var self=this;
		axios.post('/song/searchdata/', {search: this.refs.search.value.trim()}).then(function(response){
			if(response.data.status==='OK'){
				console.log(response.data.data);
				if(response.data.data.length>0){
					self.setState({songId: response.data.data[0]['_source'].songId});
				}
			}
		});
	}
	handleSearch(e){
		window.clearTimeout(this.state.query);
		this.setState({query: window.setTimeout(this.querySearch,1500)});
	}
	componentWillUnmount(){
		window.clearTimeout(this.state.query);	
	}
	render(){
		return(
			<div>
				<input type="text" ref="search" onChange={this.handleSearch}/>
				<PlayButton data={this.state.songId} />
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
			<div>
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
			<div>
				<button onClick={this.pauseSong}>Pause</button>
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
			<div>
				<button onClick={this.stopSong}>Stop</button>
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
			<div>
				<button onClick={this.volumeUp}>Volume Up</button>
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
			<div>
				<button onClick={this.volumeDown}>Volume Down</button>
			</div>
		);
	}
}

export default HomePage;
