import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { sha256 } from 'ethereumjs-util';
import { Tabs, Tab, Label } from 'react-bootstrap';
import { Observable } from 'rxjs'
import * as Web3 from './web3'

import { Form, FormControl, ControlLabel, Button, FormGroup } from 'react-bootstrap';


export class EthMainComponent extends React.Component {
  constructor(props) {
    super(props);
    let web3 = new Web3();
    // web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/metamask'))
    web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/Uw7vEslp5bpgqPgNkm05'))
    let priv = props.privateKey;
    let mywallet = wallet.fromPrivateKey(new Buffer(priv, 'hex'))
    let addr = mywallet.getAddressString();
    this.state = {
      privateKey: priv,
      address: addr,
      balance: '0.000000000000000000',
      web3: web3
    }

    window.web3 = web3
    this.getBalanceOb = Observable.interval(3000).mergeMap(() => {
      return Observable.create((observer) => {
        web3.eth.getBalance(this.state.address, (error, result) => {
          error && observer.error(error);
          error || observer.next(result);
          observer.complete();
        })
      })
    }).map(data => Number(data))
      .map(data => String(data))

    this.getBalanceObSub = this.getBalanceOb.subscribe((data) => {
      data = data.padStart(19, '0');
      data = data.replace(/(\d{18})$/, '.$1');
      this.setState({ balance: data });
    })
  }

  componentWillUnmount() {
    this.getBalanceObSub.unsubscribe();
    this.getBalanceObSub.remove();
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
          <FormControl value={this.state.address} disabled />
        </FormGroup>
      </Form>
    )
  }
}