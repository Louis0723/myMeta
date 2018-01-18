import * as React from 'react';
import { InputGroup, DropdownButton, MenuItem, FormControl, FormGroup, Button } from 'react-bootstrap';

export class ArrayInputComponent extends React.Component {
    constructor(props) {
        super(props)
        this.props.setArrayValue(this.props.index - 1, '')
    }
    setValue(event) {
        console.log('appinput')
        this.props.setArrayValue(this.props.index - 1, event.target.value)
    }
    render() {
        return (
            <InputGroup>
                <InputGroup.Addon>{this.props.index}</InputGroup.Addon>
                <FormControl type={/String/.test(this.props.inputType) ? 'text' : 'number'} onChange={this.setValue.bind(this)} />
            </InputGroup>
        )
    }
}

export class ParamInputComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputType: "String",
            value: '',
            array: [],
            arrayValue: []
        }
        this.props.setParamValue(this.props.index, this);
    }
    getValue() {
        return /\[\]/.test(this.state.inputType) ? this.state.arrayValue : this.state.value
    }
    setArrayValue(id, value) {
        console.log('paraminput')
        this.state.arrayValue[id] = value
        this.setState({ arrayValue: this.state.arrayValue }, () => {
            console.log('paraminput callback')
            this.props.setParamValue(this.props.index, this);
        })

    }

    setInputType(event) {
        this.setState({ inputType: event.target.innerText });
        // if(/\[\]/.test(event.target.innerText) ){
        //     let number = this.state.value
        //     let array = []
        //     for (let i = 0; i < Number(number|0); i++) {
        //         array.push(<ArrayInputComponent inputType={this.state.inputType} index={i+1} />)
        //     }
        //     this.setState({ array: array });
        // }
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
            let number = event.target.value
            let array = []
            for (let i = 0; i < Number(number | 0); i++) {
                array.push(<ArrayInputComponent inputType={this.state.inputType} key={i} index={i + 1} setArrayValue={this.setArrayValue.bind(this)} />)
            }
            this.setState({ array: array }, () => {
                console.log('paraminput callback')
                this.props.setParamValue(this.props.index, this);
            });
        }
    }
    render() {
        return (
            <FormGroup>
                <InputGroup>
                    <InputGroup.Button>
                        <DropdownButton title={this.state.inputType} id="bg-vertical-dropdown-1">
                            <MenuItem onClick={this.setInputType.bind(this)}>String</MenuItem>
                            <MenuItem onClick={this.setInputType.bind(this)}>Integer</MenuItem>
                            <MenuItem onClick={this.setInputType.bind(this)}>String[]</MenuItem>
                            <MenuItem onClick={this.setInputType.bind(this)}>Integer[]</MenuItem>
                        </DropdownButton>
                    </InputGroup.Button>
                    <FormControl
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