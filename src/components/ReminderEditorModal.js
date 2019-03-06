import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class ReminderEditorModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reminderName: 'New reminder',
			time: '12:00',
			color: '#000000',
			reminderIndex: 0,
			date: null,
			formattedDate: '',
			maxLength: 30
		}
	}
	
	getFormattedDate(date) {
		let month = date.getMonth()+1;
		if (month < 10) {
			month = '0'+month;
		}
		let day = date.getDate();
		if (day < 10) {
			day = '0'+day;
		}
		return (date.getFullYear()+"-"+month+"-"+day);
	}
	
	componentWillReceiveProps(nextProps) {
		let yyyymmdd = this.getFormattedDate(nextProps.date);
		this.setState({
			reminderName: nextProps.reminderName,
			time: nextProps.time,
			color: nextProps.color,
			reminderIndex: nextProps.reminderIndex,
			date: nextProps.date,
			formattedDate: yyyymmdd,
		});
	}
	
	reminderNameHandler(e) {
		this.setState({reminderName: e.target.value});
	}
	timeHandler(e) {
		this.setState({time: e.target.value});
	}
	dateHandler(e) {
		let dateParts = e.target.value.split('-');
		let newDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
		this.setState({date: newDate, formattedDate: e.target.value});
	}
	colorHandler(e) {
		this.setState({color: e.target.value});
	}
	handleDelete() {
		this.props.deleteReminder(this.state.reminderIndex);
		this.props.onHide();
	}
	handleSave() {
		const saveState = this.state;
		this.props.saveModalDetails(saveState);
		this.props.onHide();
	}
	renderButtons() {
		let buttons = [];
		buttons.push(<Button onClick={() => this.handleSave()}>Save</Button>);
		if (this.props.editing == true) {
			buttons.push(<button type="button" class="btn btn-danger" onClick={() => this.handleDelete()}>Delete</button>);
		}
		buttons.push(<Button onClick={this.props.onHide}>Close</Button>);
		return buttons;
	}
	
	render() {
		return (
			<Modal
				{...this.props}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
			
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
					{this.props.title}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<b>Reminder:</b> <input value={this.state.reminderName} maxLength={this.state.maxLength} onChange={(e) => this.reminderNameHandler(e)}/>
					<b> Date: </b><input type="date" value={this.state.formattedDate} onChange={(e) => this.dateHandler(e)}/>
					<p>
					<b>Time: </b><input type="time" value={this.state.time} onChange={(e) => this.timeHandler(e)}/>
					<b> Color: </b><input type="color" value={this.state.color} onChange={(e) => this.colorHandler(e)}/>
					</p>
				</Modal.Body>
				<Modal.Footer>
					{this.renderButtons()}
				</Modal.Footer>
				
			</Modal>
		);
	}
}
export default ReminderEditorModal;