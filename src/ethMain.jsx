import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { sha256 } from 'ethereumjs-util';
import { Tabs, Tab, Label } from 'react-bootstrap';
import { Observable } from 'rxjs';
import * as Web3 from './web3';
import ajax from '@fdaciuk/ajax';
import { outputRawTx, sign, privateKeyStringToBuffer } from './tx';

import { Form, FormControl, ControlLabel, Button, FormGroup } from 'react-bootstrap';


export class EthMainComponent extends React.Component {
  constructor(props) {
    super(props);
    let web3 = new Web3();
    // web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/metamask'))
    web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/Uw7vEslp5bpgqPgNkm05'));
    let priv = props.privateKey;
    let mywallet = wallet.fromPrivateKey(new Buffer(priv, 'hex'));
    let addr = mywallet.getAddressString();
    this.state = {
      privateKey: priv,
      address: addr,
      balance: '0.000000000000000000',
      web3: web3,

      transactionState: false,
      transactionEther: '0',
      transactionTo: '',
      transactionLimit: '300000',
      transactionPrice: '40',
      transactionTxid: '',
      transactionBlock: 'Wait...',
    }

    window.web3 = web3
    this.getBalanceOb = Observable.interval(3000).mergeMap(() => {
      return Observable.create((observer) => {
        web3.eth.getBalance(this.state.address, (error, result) => {
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
    web3.eth.getGasPrice((error, price) => {
      if (!error) {
        price = price.toString()
        console.log(price)
        this.setState({
          transactionState: !this.state.transactionState,
          transactionEther: '0',
          transactionTo: '',
          transactionLimit: '300000',
          transactionPrice: price / 1000000000
        })
      }
    })
  }

  setTransactionEther(event) {
    this.setState({ transactionEther: event.target.value });
  }
  setTransactionTo(event) {
    this.setState({ transactionTo: event.target.value });
  }
  setTransactionLimit(event) {
    this.setState({ transactionLimit: event.target.value });
  }
  setTransactionPrice(event) {
    this.setState({ transactionPrice: event.target.value });
  }
  SendTransaction() {
    if (this.state.address && this.state.transactionTo && this.state.transactionEther && this.state.transactionLimit && this.state.transactionPrice) {
      let tx = outputRawTx(this.state.address, this.state.transactionTo, web3.toWei(this.state.transactionEther), this.state.transactionLimit, this.state.transactionPrice * 1000000000)
      let txSigned = sign(privateKeyStringToBuffer(this.state.privateKey), tx);
      web3.eth.sendRawTransaction(txSigned, (err, txid) => {
        if (err) {
          console.log('Error:');
          console.log(err);
        }
        else {
          console.log(txid)
          this.setState({ transactionTxid: txid, transactionBlock: 'Wait...' })
          Observable.interval(3000).map(() => {
            return web3.eth.getTransactionReceipt(txid)
          }).filter(data => data).first().subscribe(data => {
            this.setState({ transactionBlock: data.blockNumber })
          })
        }
      });
    }
  }

  // componet exit
  componentWillUnmount() {
    this.getBalanceObSub.unsubscribe();
  }


  render() {
    if (!this.state.transactionState) {
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
          <Button bsStyle="primary" onClick={this.toTransaction.bind(this)}>Transaction</Button>
        </Form>
      )
    } else {
      return (
        <Form>
          <FormGroup>
            <ControlLabel>How many ether</ControlLabel>
            <FormControl
              type="number"
              placeholder="Ether"
              value={this.state.transactionEther}
              onChange={this.setTransactionEther.bind(this)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Who do you want to pay?:</ControlLabel>
            <FormControl
              type="text"
              placeholder="Recipient Address"
              value={this.state.transactionTo}
              onChange={this.setTransactionTo.bind(this)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Gas Limit:</ControlLabel>
            <FormControl
              type="number"
              placeholder=""
              value={this.state.transactionLimit}
              onChange={this.setTransactionLimit.bind(this)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Gas Price(Gwei):</ControlLabel>
            <FormControl
              type="number"
              placeholder=""
              value={this.state.transactionPrice}
              onChange={this.setTransactionPrice.bind(this)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Max Spend Gas :{(this.state.transactionPrice / 1000000000 * this.state.transactionLimit).toFixed(18)}</ControlLabel>
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              {(() => {
                if (this.state.transactionTxid) {
                  return (
                    <h1>Txid: 
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${this.state.transactionTxid}`}><FormControl value={this.state.transactionTxid} disabled /></a>
                    </h1>
                  )
                }
              })()
              }
            </ControlLabel>
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              {(() => {
                if (this.state.transactionTxid) {
                  return (
                    <h1>BlockNumber: 
                    <a target="_blank" href={`https://ropsten.etherscan.io/block/${this.state.transactionBlock}`}>{this.state.transactionBlock === "Wait..." ? "Wait..." : <FormControl value={this.state.transactionBlock} disabled />}</a>
                    </h1>
                  )
                }
              })()
              }
            </ControlLabel>
          </FormGroup>
          <Button onClick={this.toTransaction.bind(this)}>Back Main Page</Button>
          <Button onClick={this.SendTransaction.bind(this)}>Send Transaction</Button>
        </Form>
      )
    }
  }
}