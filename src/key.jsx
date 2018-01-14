
import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { sha256 } from 'ethereumjs-util';

export class KeyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      privateKey: '',
      privateKeyInput: '',
      address: ''
    }
  }

  makePrivateKey() {
    /* from coinb.in */
    let email = this.state.email;
    let pass = this.state.password;
    let s = email;
    s += '|' + pass + '|';
    s += s.length + '|!@' + ((pass.length * 7) + email.length) * 7;
    let regchars = (pass.match(/[a-z]+/g)) ? pass.match(/[a-z]+/g).length : 1;
    let regupchars = (pass.match(/[A-Z]+/g)) ? pass.match(/[A-Z]+/g).length : 1;
    let regnums = (pass.match(/[0-9]+/g)) ? pass.match(/[0-9]+/g).length : 1;
    s += ((regnums + regchars) + regupchars) * pass.length + '3571';
    s += (s + '' + s);
    for (let i = 0; i <= 50; i++) {
      s = sha256(s).toString('hex');
    };

    let address = wallet.fromPrivateKey(new Buffer(s, 'hex')).getAddressString()
    this.setState({ privateKey: s });
    this.setState({ privateKeyInput: s });
    this.setState({ address: address });
  }

  setEmail(e) {
    this.setState({ email: e.target.value }, this.makePrivateKey);
  }

  setPassword(e) {
    this.setState({ password: e.target.value }, this.makePrivateKey);
  }

  setPrivateKey(e) {
    this.setState({ privateKeyInput: e.target.value });
    if (e.target.value.length === 64) {
      let address = wallet.fromPrivateKey(new Buffer(e.target.value, 'hex')).getAddressString()
      this.setState({ privateKey: e.target.value });
      this.setState({ address: address });
    }
  }

  setNewPrivateKey() {
    if (this.state.privateKeyInput.length === 64) {
      let privateKey=this.state.privateKeyInput;
      let keys = localStorage.getItem('privateKeys');
      keys = !keys ? [] : JSON.parse(keys)
      if (keys.indexOf(privateKey) === -1) {
        keys.push(privateKey);
      }
      keys = JSON.stringify(keys);
      localStorage.setItem('privateKeys', keys);
    }
  }

  render() {
    return (
      <div>
        email<input type="email" onChange={this.setEmail.bind(this)} />
        password<input type="password" onChange={this.setPassword.bind(this)} />
        privateKey<input type="privateKey" value={this.state.privateKeyInput} onChange={this.setPrivateKey.bind(this)} maxLength="64" />
        address: {this.state.address}
        <button onClick={this.setNewPrivateKey.bind(this)} >save</button>
      </div>
    );
  }

}
