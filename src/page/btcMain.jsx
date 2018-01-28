import * as React from 'react';
import { parseWIF } from '../vo/tx';
import { Observable } from 'rxjs'
import { ECPair } from 'bitcoinjs-lib'
import { Form, FormControl, ControlLabel, Button, FormGroup, InputGroup } from 'react-bootstrap';
import ajax from '@fdaciuk/ajax';

export class BtcMainComponent extends React.Component {
  constructor(props) {
    super(props);
    let priv = props.privateKey;
    let wif = parseWIF(new Buffer(props.privateKey, 'hex'));
    let ecPair = ECPair.fromWIF(wif);
    let address = ecPair.getAddress();
    let publicKeyBuffer = ecPair.getPublicKeyBuffer();
    let publicKey = publicKeyBuffer.toString('hex');
    this.ajax = ajax();
    this.state = {
      privateKey: priv,
      wif: wif,
      address: address,
      publicKey: publicKey,
      balance: '0.00000000',
      passwordType: 'password'
    }
    this.getBalanceOb = Observable.interval(3000).mergeMap(() => {
      return Observable.create((observer) => {
        let request = ajax().get(`https://blockchain.info/q/addressbalance/${this.state.address}`)
        request.then((response, xhr) => {
          observer.next(response);
          observer.complete();
        }).catch((response, xhr) => {
          observer.error(response);
          observer.complete();
        })
      })
    })
    this.getBalanceObSub = this.getBalanceOb.subscribe((data) => {
      data = String(data)
      data = data.padStart(9, '0');
      data = data.replace(/(\d{8})$/, '.$1');
      this.setState({ balance: data });
    });
  }

  // componet exit
  componentWillUnmount() {
    this.getBalanceObSub.unsubscribe();
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <ControlLabel>Balance:</ControlLabel>
          <FormControl value={this.state.balance} disabled />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Address:</ControlLabel>
          <FormControl value={this.state.publicKey} disabled />
        </FormGroup>
        <FormGroup>
          <ControlLabel>PublicKey:</ControlLabel>
          <FormControl value={this.state.address} disabled />
        </FormGroup>
        <FormGroup>
          <ControlLabel>PrivateKey:</ControlLabel>
          <InputGroup>
            <FormControl type={this.state.passwordType} value={this.state.wif} disabled />
            <InputGroup.Addon onClick={() => this.setState.call(this, { passwordType: this.state.passwordType === 'password' ? 'text' : 'password' })}>Show</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </Form>
    )
  }
}