import * as React from 'react';
import { InputGroup, DropdownButton, MenuItem, FormControl, FormGroup, Button } from 'react-bootstrap';


// 本code 特髒
export class ArrayInputComponent extends React.Component {
	constructor(props) {
		super(props)
		this.props.setArrayValue && this.props.setArrayValue(this.props.index - 1, '')
	}
	setValue(event) {
		console.log('appinput')
		this.props.setArrayValue && this.props.setArrayValue(this.props.index - 1, event.target.value)
	}
	render() {
		return (
			<InputGroup>
				<InputGroup.Addon>{this.props.index}</InputGroup.Addon>
				<FormControl
					required
					type={/String/.test(this.props.inputType) ? 'text' : 'number'}
					onChange={this.setValue.bind(this)} />
			</InputGroup>
		)
	}
}

// 本code 特髒
export class ParamInputComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			inputType: this.props.type || "String",
			value: '',
			array: [],
			arrayValue: []
		}
		this.props.setParamValue && this.props.setParamValue(this.props.index, this);
	}
	getValue() {
		if (/\[\]/.test(this.state.inputType)) {
			for (let index in this.state.arrayValue) {
				this.state.arrayValue[index] = /Integer/.test(this.state.inputType) ? Number(state.arrayValue[index]) : state.arrayValue[index];
			}
			return this.state.arrayValue;
		} else {
			return this.state.value = /Integer/.test(this.state.value) ? Number(this.state.value) : this.state.value

		}
	}
	setArrayValue(id, value) {
		console.log('paraminput')
		this.state.arrayValue[id] = value
		this.setState({ arrayValue: this.state.arrayValue }, () => {
			console.log('paraminput callback')
			this.props.setParamValue && this.props.setParamValue(this.props.index, this);
		})

	}

	setInputType(event) {
		this.setState({ inputType: event.target.innerText });
		this.setState({ array: [] }, () => {
			console.log('paraminput callback')
			this.props.setParamValue(this.props.index, this);
		});
	}
	setValue(event) {
		console.log('paraminput')
		this.setState({ value: event.target.value }, () => {
			this.props.setParamValue(this.props.index, this);
		});
		if (/\[\]/.test(this.state.inputType)) {
			let num = Number(event.target.value) | 0;
			num = num > 100 ? 99 : num
			num = num < -1 ? 0 : num
			let array = []
			for (let i = 0; i < num; i++) {
				array.push(<ArrayInputComponent inputType={this.state.inputType} key={i} index={i + 1} setArrayValue={this.setArrayValue.bind(this)} />)
			}
			this.setState({ array: array }, () => {
				console.log('paraminput callback')
				this.props.setParamValue(this.props.index, this);
			});
		}
	}
	render() {
		let button = !this.props.lock ?
			(<InputGroup.Button>
				<DropdownButton title={this.state.inputType} id="bg-vertical-dropdown-1">
					<MenuItem onClick={this.setInputType.bind(this)}>String</MenuItem>
					<MenuItem onClick={this.setInputType.bind(this)}>Integer</MenuItem>
					<MenuItem onClick={this.setInputType.bind(this)}>String[]</MenuItem>
					<MenuItem onClick={this.setInputType.bind(this)}>Integer[]</MenuItem>
				</DropdownButton>
			</InputGroup.Button>) : (<InputGroup.Button><Button>{this.state.inputType}</Button></InputGroup.Button>)
		return (
			<FormGroup>
				<InputGroup>
					{button}
					<FormControl
						required
						maxLength={/\[\]/.test(this.state.inputType) ? '2' : '9999999'}
						type={/\[\]|Integer/.test(this.state.inputType) ? 'number' : 'text'}
						placeholder={/\[\]/.test(this.state.inputType) ? 'Array Length' : 'Value'}
						onChange={this.setValue.bind(this)} />
				</InputGroup>
				{this.state.array}
			</FormGroup>
		)
	}
}