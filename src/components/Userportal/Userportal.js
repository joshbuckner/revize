import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Uploader from '../Uploader/Uploader';
import './Userportal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Userportal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			db: [
				'Song 1', 'Song 2', 'Song 3'
			],
			currentSong: ""
		}
	}

	handleSongClick = (event) => {
		this.props.loadSong(event.target.innerText);
		this.props.onRouteChange('songView');
	}

	createList = () => {
		let list = [];
		for (let i = 0; i < this.props.user.songs.length; i++) {
  		list.push(
  			<Row key={i}>
	  			<Col>
		  			<li className="list-song">
		  				<Row>
		  					<Col onClick={this.handleSongClick}>
			  					{this.props.user.songs[i].name}
			  				</Col>
			  				<Col xs="2" sm="2" md="1" lg="1" xl="1">
			  					<FontAwesomeIcon className="song-options-icon" icon="ellipsis-h" />
			  				</Col>
			  			</Row>
		  			</li>
	  			</Col>
	  		</Row>
  		);
		}
		return list;
	}

	// createSong = (name) => {
	// 	this.setState({db: this.props.user.songs.concat(name)});
	// }

	render() {
    return (
    	<div className="Userportal">
    		<Container>
    			<Row>
          	<Col className="songs-container">
          		<div className="list-container">
	          		<h6>Owner</h6>
	          		<ul>
	          			{this.createList()}
	          		</ul>
          		</div>
          		<div className="list-container">
	          		<h6>Member</h6>
	          		<ul>
	          			{this.createList()}
	          		</ul>
	          	</div>
          		<Uploader createSong={this.createSong} loadSong={this.props.loadSong} user={this.props.user} loadUser={this.props.loadUser} onRouteChange={this.props.onRouteChange}/>
          	</Col>
          </Row>
    		</Container>
    	</div>
    );
  }
}

export default Userportal;