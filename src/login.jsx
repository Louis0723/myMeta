
import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { makePrivateKey } from './tx';
import { Form, FormControl, ControlLabel, Button, FormGroup, InputGroup } from 'react-bootstrap';
import { AlertComponent } from './alert'



// import * as Identicon from 'identicon.js'
// import {
//   sha256
// } from 'ethereumjs-util';

export class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      privateKeyInput: '',
      passwordType: 'password',
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
        event.preventDefault();
        return;
      }
      if (!(/.{8,}/.test(this.state.password))) {
        event.preventDefault();
        return;
      }
    } else if (Number(this.state.email === '') ^ Number(this.state.password === '')) {
      event.preventDefault();
      return;
    } else if (!(/^(0x)?[a-f0-9]+$/.test(this.state.privateKeyInput))) {
      event.preventDefault();
      return;
    }
    if (this.state.privateKeyInput.length === 66 || this.state.privateKeyInput.length === 64) {
      let privateKey = this.state.privateKeyInput;
      let keys = localStorage.getItem('privateKeys');
      keys = !keys ? [] : JSON.parse(keys)
      if (keys.indexOf(privateKey) === -1) {
        keys.push(privateKey);
      }
      keys = JSON.stringify(keys);
      localStorage.setItem('privateKeys', keys);

      this.props.login(this.state.privateKeyInput);
    }
    event.preventDefault();
  }

  // identicon() {
  //   let base64Img = new Identicon(sha256(this.state.privateKeyInput).toString('hex'),{size: 512}).toString()
  //   return `data:image/svg;base64,${base64Img}`
  // }
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
          <InputGroup>
            <FormControl
              type={this.state.passwordType}
              value={this.state.privateKeyInput}
              placeholder="PrivateKey"
              onChange={this.setPrivateKey.bind(this)}
              maxLength="66"
              pattern="^(0x)?[a-f0-9]+$"
            />
            <InputGroup.Addon onClick={() => this.setState.call(this, { passwordType: this.state.passwordType === 'password' ? 'text' : 'password' })}>Show</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        {/* <Image href="#" circle height="120" width="120" alt="120*120" src={this.identicon()} /> */}

        <Button type="submit" >Login</Button>

      </Form>
    );
  }
}
