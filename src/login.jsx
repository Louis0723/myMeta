
import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { sha256 } from 'ethereumjs-util';
import { makePrivateKey } from './tx';
import { Form, FormControl, ControlLabel, Button, FormGroup } from 'react-bootstrap';


export class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      privateKeyInput: '',
      // address: ''
    }
  }

  makePrivateKey() {
    let priv = makePrivateKey(this.state.email, this.state.password);

    this.setState({ privateKeyInput: priv });
    // this.setState({ address: address });
  }

  setEmail(e) {
    this.setState({ email: e.target.value }, this.makePrivateKey);
  }

  setPassword(e) {
    this.setState({ password: e.target.value }, this.makePrivateKey);
  }

  setPrivateKey(e) {
    this.state.email && this.setState({ email: '' });
    this.state.password && this.setState({ password: '' });
    this.setState({ privateKeyInput: e.target.value });

    if (e.target.value.length === 64 || e.target.value.length === 66) {
      if (/^(0x)?([a-f0-9]{64})$/g.test(e.target.value)) {
        let priv = e.target.value.substring(e.target.value.length - 64);
        this.setState({ privateKeyInput: priv });
      } else {
        this.setState({ address: '' });
        return;
      }
    }
  }

  setNewPrivateKey(event) {
    if (this.state.email !== '' && this.state.password !== '') {
      if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.state.email))) {
        console.log(1)
        event.preventDefault()
        return
      }
      if (!(/.{8,}/.test(this.state.password))) {
        console.log(2)
        event.preventDefault()
        return
      }
    } else if (Number(this.state.email === '') ^ Number(this.state.password === '')) {
      console.log(3)
      event.preventDefault()
      return
    } else if (!(/^(0x)?[a-f0-9]+$/.test(this.state.privateKeyInput))) {
      console.log(4)
      event.preventDefault()
      return
    }
    if (this.state.privateKeyInput.length === 66 || this.state.privateKeyInput.length === 64) {
      console.log(5)
      let privateKey = this.state.privateKeyInput;
      let keys = localStorage.getItem('privateKeys');
      keys = !keys ? [] : JSON.parse(keys)
      if (keys.indexOf(privateKey) === -1) {
        keys.push(privateKey);
      }
      keys = JSON.stringify(keys);
      localStorage.setItem('privateKeys', keys);

      this.props.login(this.state.privateKeyInput)
    }
    event.preventDefault()
  }

  render() {
    return (
      <Form onSubmit={this.setNewPrivateKey.bind(this)}>
        <h1>The Wallet</h1>
        {/* <ControlLabel><h1>Address: {this.state.address}</h1></ControlLabel> */}
        <FormGroup>
          <ControlLabel>Email:</ControlLabel>
          <FormControl
            type="email"
            value={this.state.email}
            placeholder="Email"
            onChange={this.setEmail.bind(this)}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Password:</ControlLabel>
          <FormControl
            type="password"
            value={this.state.password}
            placeholder="Password"
            onChange={this.setPassword.bind(this)}
            pattern=".{8,}"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>PrivateKey:</ControlLabel>
          <FormControl
            type="text"
            value={this.state.privateKeyInput}
            placeholder="PrivateKey"
            onChange={this.setPrivateKey.bind(this)}
            maxLength="66"
            pattern="^(0x)?[a-f0-9]+$"
          />
        </FormGroup>

        <Button type="submit" >Login</Button>
      </Form>

    );
  }

}
