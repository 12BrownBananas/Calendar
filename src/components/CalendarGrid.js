import React from 'react';
import Square from './Square.js';

function DayOfWeekMarker(props) {
	return (
		<div class="dayOfWeekMarker">{props.weekday}</div>
	);
}

class CalendarGrid extends React.Component {  
	createHeader(daysOfWeekArray) {
		const calendarTitle = [];
		calendarTitle.push(<button onClick={this.props.handlePreviousMonth}>Previous Month</button>);
		calendarTitle.push(<> {this.props.calendarPageHeader} </>);
		calendarTitle.push(<button onClick={this.props.handleNextMonth}>Next Month</button>);
		const header = [];
		for (let i = 0; i < daysOfWeekArray.length; i++) {
			header.push(this.renderWeekdayMarker(i, daysOfWeekArray[i]));
		}
		return (<div className="grid-row">{calendarTitle}<p>{header}</p></div>);
	}
	
	createGrid(row, col) {
		const grid = [];
		let cellCounter = 0;
		for (let i = 0; i < row; i++) {
		  const columns = [];
		  for (let j = 0; j < col; j++) {
			  columns.push(this.renderSquare(cellCounter));
			  cellCounter++;
		  }
		  grid.push(<div className="grid-row">{columns}</div>);
		}
		return grid;
	}
	renderWeekdayMarker(i, dayOfWeek) {
		return (
			<DayOfWeekMarker
				weekday = {dayOfWeek}
			/>
		);
	}
	
	datesAreEquivalent(d1, d2) {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	}
	
	getRelevantReminders(currentDate) {
		let relevantReminders = [];
		for (let i = 0; i < this.props.reminders.length; i++) {
			if (this.datesAreEquivalent(this.props.reminders[i].date, currentDate)) {
				relevantReminders.push(this.props.reminders[i]);
			}
		}
		return relevantReminders;
	}
	renderSquare(i) {
		const date = this.props.squares[i];
		const blankSquare = date.getMonth() === this.props.startDate.getMonth() ? '' : 'square--blank';
		const relevantReminders = this.getRelevantReminders(this.props.squares[i]);
		return (
			<Square 
				blankSquare={blankSquare}
				date={date}
				onClick={()=>this.props.onClick(i)}
				onClickReminder={this.props.onClickReminder}
				reminders={relevantReminders}
			/>
		);
	}
  
  render() {
    return <div>{this.createHeader(this.props.daysOfWeekArray)}{this.createGrid(6, 7)}</div>;
  }
}

export default CalendarGrid;