import React from 'react';
import axios from 'axios';

class PlayButton extends React.Component{
	constructor(props){
		super(props);
		this.playSong=this.playSong.bind(this);
	}
	playSong(e){
		axios.post('/song/play/', {songId: this.props.data}).then(function(response){
			console.log(response);
		});
	}
	render(){
		return(
			<div>
				<button onClick={this.playSong}>Play</button>
			</div>
		);
	}
}

export default PlayButton;
