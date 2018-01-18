import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { Observable } from 'rxjs';
import { outputRawTx, sign, privateKeyStringToBuffer } from './tx';
import { Form, FormControl, ControlLabel, Button, FormGroup } from 'react-bootstrap';


export class EthAdvTxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.toTransaction = this.props.toTransaction;
    this.cancelTransaction = this.props.cancelTransaction;
    let priv = props.privateKey;
    let address = props.address;
    this.state = {
      address: address,
      privateKey: priv,
      transactionEther: '0',
      transactionTo: '',
      transactionLimit: '300000',
      transactionPrice: '40',
      transactionTxid: '',
      transactionBlock: 'Wait...',
    }
    web3.eth.getGasPrice((error, price) => {
      this.setState({
        transactionPrice: error ? '40' : price.toString() / 1000000000,
      })
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
  sendTransaction() {
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
  componentWillMount() { }
  render() {
    return (
      <Form>
        <FormGroup>
          <ControlLabel>How many ether?</ControlLabel>
          <FormControl
            type="number"
            placeholder="Ether"
            value={this.state.transactionEther}
            onChange={this.setTransactionEther.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Contract Address:</ControlLabel>
          <FormControl
            type="text"
            placeholder="Contract Address"
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
          <ControlLabel>ABI:</ControlLabel>
          <FormControl
            type="text"
            placeholder="Application Binary Interface"
            // value={this.state.transactionPrice}
            // onChange={this.setTransactionPrice.bind(this)}
          />
        </FormGroup>
        <Button onClick={this.cancelTransaction}>Back Main Page</Button>
        <Button bsStyle="danger" onClick={this.toTransaction}>Deploy SmartContract</Button>
        {/* <FormGroup>
          {(() => {
            if (this.state.transactionTxid) {
              return (
                <div>
                  <ControlLabel>Txid:</ControlLabel>
                  <a target="_blank" href={`https://ropsten.etherscan.io/tx/${this.state.transactionTxid}`}>
                    <FormControl value={this.state.transactionTxid} disabled />
                  </a>
                </div>
              )
            }
          })()
          }
        </FormGroup>
        <FormGroup>
          {(() => {
            if (this.state.transactionTxid) {
              return (
                <div>
                  <ControlLabel>BlockNumber:</ControlLabel>
                  {this.state.transactionBlock === "Wait..." ? "Wait..." :
                    <a target="_blank" href={`https://ropsten.etherscan.io/block/${this.state.transactionBlock}`}>
                      <FormControl value={this.state.transactionBlock} disabled />
                    </a>}
                </div>
              )
            }
          })()
          }
        </FormGroup> */}
        
        {/* <Button bsStyle="primary" onClick={this.sendTransaction.bind(this)}>Send Transaction</Button> */}
      </Form>
    )
  }
}
