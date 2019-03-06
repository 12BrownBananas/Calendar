import React, { Component } from 'react';

class Reminder extends Component {		
	render() {
		var buttonStyle = {
			backgroundColor: this.props.color,
		}
		return( 
			<button class="reminder" style={buttonStyle} onClick={this.props.onClick}>{this.props.title}</button>
		);
	}
}

export default Reminder;