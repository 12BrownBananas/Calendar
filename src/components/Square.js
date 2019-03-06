import React from 'react';
import Reminder from './Reminder.js';

class Square extends React.Component {
	constructor(props){
		super(props);
		this.handleReminderClick = this.handleReminderClick.bind(this);
		this.state = {
			mouseOver: false,
		};
	}
	mouseEnter() {
		this.setState({ mouseOver: true });
	}
	mouseLeave() {
		this.setState({ mouseOver: false });
	}
	
	handleReminderClick(reminderIndex) {
		this.props.onClickReminder(reminderIndex);
	}
	
	sortRemindersByTime(reminders) {
		reminders.sort(function(a, b){return a.time.localeCompare(b.time)});
		return reminders;
	}
	convertToTwelveHourTime(time) {
		let suffix = 'AM';
		let timeArray = time.split(':');
		let hour = timeArray[0];
		let minutes = timeArray[1];
		if (hour >= 12) {
			hour-=12;
			suffix = 'PM';
		}
		if (hour == 0) {
			hour = 12;
		}
		return hour+":"+minutes+" "+suffix;
	}
	
	renderReminders(reminders) {
		const reminderArray = [];
		if (reminders.length > 1) {
			reminders = this.sortRemindersByTime(reminders);
		}
		for (let i = 0; i < reminders.length; i++) {
			let reminder = reminders[i];
			reminderArray.push(<Reminder 
			onClick={reminderIndex => this.handleReminderClick(reminder.index)} 
			title={reminder.title+' ('+this.convertToTwelveHourTime(reminder.time)+')'}
			color={reminder.color}
			/>);
		}
		return reminderArray;
	}
	renderAddButton() {
		if (this.state.mouseOver) {
			return <button class="addButton" onClick={this.props.onClick}>+</button>
		}
	}
	render() {
		return (
			<div onMouseEnter={() => this.mouseEnter()} onMouseLeave={() => this.mouseLeave()} className={`${this.props.blankSquare} square`} >
				<span>{this.props.date.getDate()}</span>
				<p>
				{this.renderReminders(this.props.reminders)}
				</p>
				{this.renderAddButton()}
			</div>
		);
	}
}

export default Square;