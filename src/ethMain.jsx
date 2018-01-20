import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { Observable } from 'rxjs';
import { EthTxComponent } from './ethTx'
import { EthAdvTxComponent } from './ethAdvTx'
import { EthDeploySmartContractComponent } from './ethDeploy'

import { Form, FormControl, ControlLabel, Button, FormGroup, InputGroup } from 'react-bootstrap';


export class EthMainComponent extends React.Component {
  constructor(props) {
    super(props);
    let priv = props.privateKey;
    let mywallet = wallet.fromPrivateKey(new Buffer(priv, 'hex'));
    let addr = mywallet.getAddressString();
    this.state = {
      privateKey: priv,
      address: addr,
      balance: '0.000000000000000000',
      transactionState: 0,
      passwordType: 'password',
    }


    this.getBalanceOb = Observable.interval(3000).mergeMap(() => {
      return Observable.create((observer) => {
        this.props.web3.eth.getBalance(this.state.address, (error, result) => {
          error && observer.error(error);
          error || observer.next(result);
          observer.complete();
        });
      });
    }).map(data => Number(data))
      .map(data => String(data))

    this.getBalanceObSub = this.getBalanceOb.subscribe((data) => {
      data = data.padStart(19, '0');
      data = data.replace(/(\d{18})$/, '.$1');
      this.setState({ balance: data });
    })
  }

  toTransaction() {
    this.setState({
      transactionState: this.state.transactionState + 1
    })
  }
  cancelTransaction() {
    this.setState({
      transactionState: 0
    })
  }

  // componet exit
  componentWillUnmount() {
    this.getBalanceObSub.unsubscribe();
  }


  render() {

    if (this.state.transactionState === 0) {
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
          <FormGroup>
            <ControlLabel>PrivateKey:</ControlLabel>
            <InputGroup>
              <FormControl type={this.state.passwordType} value={this.state.privateKey} disabled />
              <InputGroup.Addon onClick={() => this.setState.call(this, { passwordType: this.state.passwordType === 'password' ? 'text' : 'password' })}>Show</InputGroup.Addon>
            </InputGroup>
          </FormGroup>

          <Button bsStyle="primary" onClick={this.toTransaction.bind(this)}>Transaction</Button>
        </Form >
      )
    } else if (this.state.transactionState === 1) {
      return (
        <EthTxComponent web3={this.props.web3} address={this.state.address} privateKey={this.state.privateKey} cancelTransaction={this.cancelTransaction.bind(this)} toTransaction={this.toTransaction.bind(this)} />
      )
    } else if (this.state.transactionState === 2) {
      return (
        <EthAdvTxComponent web3={this.props.web3} address={this.state.address} privateKey={this.state.privateKey} cancelTransaction={this.cancelTransaction.bind(this)} toTransaction={this.toTransaction.bind(this)} />
      )
    } else if (this.state.transactionState === 3) {
      return (
        <EthDeploySmartContractComponent web3={this.props.web3} address={this.state.address} privateKey={this.state.privateKey} cancelTransaction={this.cancelTransaction.bind(this)} />
      )
    }
  }
}