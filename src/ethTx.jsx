import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { Observable } from 'rxjs';
import { outputRawTx, sign, privateKeyStringToBuffer } from './tx';
import { Form, FormControl, ControlLabel, Button, FormGroup, ButtonGroup } from 'react-bootstrap';
import { AlertComponent } from './alert'

export class EthTxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.toTransaction = this.props.toTransaction;
    this.cancelTransaction = this.props.cancelTransaction;
    let priv = props.privateKey;
    let address = props.address;
    this.state = {
      alertVisible: false,
      address: address,
      privateKey: priv,
      transactionEther: '0',
      transactionTo: '',
      transactionLimit: '300000',
      transactionPrice: '40',
      transactionData: '',
      transactionTxid: '',
      transactionBlock: 'Wait...',
    }
    this.props.web3.eth.getGasPrice((error, price) => {
      this.setState({
        transactionPrice: error ? '40' : price.toString() / 1000000000,
      })
    })
  }
  setTransactionData(event) {
    this.setState({ transactionData: event.target.value });
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
    this.setState({ alertVisible: false })
    if (this.state.address && this.state.transactionEther && this.state.transactionLimit && this.state.transactionPrice) {

      let param = {
        from: this.state.address,
        ether: this.props.web3.toWei(this.state.transactionEther),
        gasLimit: this.state.transactionLimit,
        gasPrice: this.state.transactionPrice * 1000000000,
      }

      if (this.state.transactionData) {
        param.payloadData = /^0x/.test(this.state.transactionData) ? this.state.transactionData : this.props.web3.toHex(this.state.transactionData);
      }
      this.state.transactionTo && (param.to = this.state.transactionTo);

      let tx = outputRawTx(param)
      let txSigned = sign(privateKeyStringToBuffer(this.state.privateKey), tx);
      this.props.web3.eth.sendRawTransaction(txSigned, (err, txid) => {
        if (err) {
          console.log(err);
        }
        else {
          this.setState({ transactionTxid: txid, transactionBlock: 'Wait...' })
          Observable.interval(3000).map(() => {
            return this.props.web3.eth.getTransactionReceipt(txid)
          }).filter(data => data).first().subscribe(data => {
            this.setState({ transactionBlock: data.blockNumber })
          })
        }
      });
    }
  }
  closeAlert(){
    this.setState({ alertVisible: false })
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
            required
            value={this.state.transactionEther}
            onChange={this.setTransactionEther.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Who do you want to pay?:</ControlLabel>
          <FormControl
            type="text"
            placeholder="Recipient Address"
            required
            value={this.state.transactionTo}
            onChange={this.setTransactionTo.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Gas Limit:</ControlLabel>
          <FormControl
            type="number"
            placeholder=""
            required
            value={this.state.transactionLimit}
            onChange={this.setTransactionLimit.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Gas Price(Gwei):</ControlLabel>
          <FormControl
            type="number"
            placeholder=""
            required
            value={this.state.transactionPrice}
            onChange={this.setTransactionPrice.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Data(Option):</ControlLabel>
          <FormControl
            type="text"
            componentClass="textarea"
            placeholder="Data"
            value={this.state.transactionData}
            onChange={this.setTransactionData.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Max Spend Gas :{(this.state.transactionPrice / 1000000000 * this.state.transactionLimit).toFixed(18)}</ControlLabel>
        </FormGroup>
        <FormGroup>
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
                  {this.state.transactionBlock === "Wait..." ?
                    <FormControl value="Wait..." disabled /> :
                    <a target="_blank" href={`https://ropsten.etherscan.io/block/${this.state.transactionBlock}`}>
                      <FormControl value={this.state.transactionBlock} disabled />
                    </a>}
                </div>
              )
            }
          })()
          }
        </FormGroup>
        <ButtonGroup>
          <Button onClick={this.cancelTransaction}>Back Main Page</Button>
          <Button bsStyle="primary" onClick={() => { this.setState({ alertVisible: alert }) }}>Send Transaction</Button>
          <AlertComponent visible={this.state.alertVisible} type="info" title="check send transaction" sure={this.sendTransaction.bind(this)} close={this.closeAlert.bind(this)} />
        </ButtonGroup>
        <Button bsStyle="danger" onClick={this.toTransaction}>Advanced Transaction</Button>
      </Form>
    )
  }
}
