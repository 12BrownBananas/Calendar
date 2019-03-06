import React from 'react';

import ReminderEditorModal from './ReminderEditorModal.js';
import CalendarGrid from './CalendarGrid';

class Calendar extends React.Component {
	constructor(props) {
		super(props);
		
		this.saveEditMenu = this.saveEditMenu.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.deleteReminder = this.deleteReminder.bind(this);
		
		let currDate = this.getCurrentDate();
		this.state = {
			stepNumber: 0,
			xIsNext: true,
			gridSize: 6*7,
			daysInMonth: this.getDaysInMonth(currDate.getMonth(), currDate.getFullYear()),
			startDate: this.getStartDateOfMonth(currDate.getMonth(), currDate.getFullYear()),
			squares: [],
			daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			monthsOfYear: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			reminders: [],
			showEditMenu: false,
			editMenu: {
				title: 'Add reminder',
				reminderName: 'New reminder',
				time: '12:00',
				color: '#ececec',
				reminderIndex: 0,
				date: null,
				editing: false,
			}
		};
		let dateOffset = -this.state.startDate.getDay()+1;
		for (let i = 0; i < this.state.gridSize; i++) {
			this.state.squares[i] = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), dateOffset);
			dateOffset++;
		}
	}
	
	updateSquaresData(newStartDate) {
		let dateOffset = -newStartDate.getDay()+1;
		let newSquares = [];
		for (let i = 0; i < this.state.gridSize; i++) {
			newSquares[i] = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), dateOffset);
			dateOffset++;
		}
		let newEditMenu = this.state.editMenu;
		newEditMenu.date = newStartDate;
		this.setState({
			startDate: newStartDate,
			squares: newSquares,
			editMenu: newEditMenu,
		});
	}
	
	goToNextMonth() {
		let currMonth = this.state.startDate.getMonth();
		let currYear = this.state.startDate.getFullYear();
		if (currMonth < 11) {
			currMonth++;
		}
		else {
			currMonth = 0;
			currYear++;
		}
		let newStartDate = new Date(currYear, currMonth, 1);
		this.updateSquaresData(newStartDate);
	}
	goToPreviousMonth() {
		let currMonth = this.state.startDate.getMonth();
		let currYear = this.state.startDate.getFullYear();
		if (currMonth > 0) {
			currMonth--;
		}
		else {
			currMonth = 11;
			currYear--;
		}
		let newStartDate = new Date(currYear, currMonth, 1);
		this.updateSquaresData(newStartDate);
	}
	getCurrentDate() {
		return new Date();
	}
	getDaysInMonth(month, year) {
		return new Date(year, month+1, 0).getDate();
	}
	getStartDateOfMonth(month, year) {
		return new Date(year, month, 1);
	}
	getDateString(date) {
		return this.state.monthsOfYear[date.getMonth()]+" "+date.getDate();
	}
	getCalendarPageString(date) {
		return this.state.monthsOfYear[date.getMonth()]+" "+date.getFullYear();
	}
	
	handleClose() {
		this.setState(
		{
			showEditMenu: false
		}
		);
	}	
	handleAdd(i) {
		let date = this.state.squares[i];
		let dateString = "Adding reminder for " +this.getDateString(date);
		let newEditMenu = this.state.editMenu;
		newEditMenu.title = dateString;
		newEditMenu.reminderName = "New reminder";
		newEditMenu.date = date;
		newEditMenu.reminderIndex = this.state.reminders.length;
		newEditMenu.color = '#ececec';
		newEditMenu.editing = false;
		this.setState(
		{
			showEditMenu: true,
			editMenu: newEditMenu,
		}
		);
	}
	setEditMenuToReminder(editMenu, reminder) {
		editMenu.reminderName = reminder.title;
		editMenu.time = reminder.time;
		editMenu.color = reminder.color;
		editMenu.reminderIndex = reminder.index;
		editMenu.date = reminder.date;
		return editMenu;
	}
	
	handleEdit(reminderIndex) {
		let reminder = this.state.reminders[reminderIndex];
		let date = reminder.date;
		let dateString = "Editing reminder for "+this.getDateString(date);
		let newEditMenu = this.state.editMenu;
		newEditMenu.title = dateString;
		newEditMenu = this.setEditMenuToReminder(newEditMenu, reminder); 
		newEditMenu.editing = true;
		this.setState(
		{
			showEditMenu: true,
			editMenu: newEditMenu,
		}
		);
	}
	
	saveEditMenu(saveState) {
		let newReminderArray = this.state.reminders.slice();
		let newReminder = { 
			title: saveState.reminderName,
			time: saveState.time,
			color: saveState.color,
			date: saveState.date,
			index: saveState.reminderIndex,
		}
		if (saveState.reminderIndex >= newReminderArray.length) { //append new reminder
			newReminderArray.push(newReminder);
		}
		else {
			newReminderArray[saveState.reminderIndex] = newReminder;
		}
		this.setState(
		{
			reminders: newReminderArray,
		}
		);
	}
	
	deleteReminder(reminderIndex) {
		let newReminderArray = this.state.reminders.slice();
		newReminderArray.splice(reminderIndex, 1);
		for (let i = 0; i < newReminderArray.length; i++) {
			newReminderArray[i].index = i;
		}
		this.setState({
			reminders: newReminderArray,
		});
	}
	
	render() { 
		return (
			<div className="interface">
				<div>
					<CalendarGrid 
					daysOfWeekArray ={this.state.daysOfWeek}
					startDate = {this.state.startDate}
					squares={this.state.squares}
					daysInMonth={this.state.daysInMonth}
					onClick={i => this.handleAdd(i)}
					onClickReminder={this.handleEdit}
					reminders={this.state.reminders}
					calendarPageHeader={this.getCalendarPageString(this.state.startDate)}
					handleNextMonth={() => this.goToNextMonth()}
					handlePreviousMonth={() => this.goToPreviousMonth()}
					/>
				</div>
				<ReminderEditorModal
					show={this.state.showEditMenu}
					onHide={()=>this.handleClose()}
					title={this.state.editMenu.title}
					reminderName={this.state.editMenu.reminderName}
					time={this.state.editMenu.time}
					color={this.state.editMenu.color}
					reminderIndex={this.state.editMenu.reminderIndex}
					date={this.state.editMenu.date}
					saveModalDetails={this.saveEditMenu}
					deleteReminder={this.deleteReminder}
					editing={this.state.editMenu.editing}
				/>
			</div>
			
		);
  }
}

export default Calendar;