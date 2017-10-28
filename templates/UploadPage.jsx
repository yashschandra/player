import React from 'react';
import axios from 'axios';

class UploadPage extends React.Component{
	constructor(props){
		super(props);
		this.uploadSong=this.uploadSong.bind(this);
	}
	uploadSong(e){
		const self=this;
		const name=this.refs.name.value.trim();
		const file=this.refs.file.files[0];
		let data=new FormData();
		data.append('name', name);
		data.append('file', file);
		axios.post('/song/upload/', data).then(function(response){
			if(response.data.status==='OK'){
				self.refs.name.value='';
				self.refs.file.value='';
			}
		});
	}
	render(){
		return(
			<div>
				<input type="text" ref="name"/>
				<input type="file" ref="file"/>
				<button onClick={this.uploadSong}>Click</button>
			</div>
		);
	}
}

export default UploadPage;
