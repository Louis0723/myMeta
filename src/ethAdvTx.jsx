import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { Observable } from 'rxjs';
import { outputRawTx, sign, privateKeyStringToBuffer } from './tx';
import { Form, FormControl, ControlLabel, Button, FormGroup, PanelGroup, Panel } from 'react-bootstrap';


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
      transactionTo: '0x',
      transactionLimit: '3000000',
      transactionPrice: '40',
      transactionTxid: '',
      transactionBlock: 'Wait...',
      abi: [],
    }
    web3.eth.getGasPrice((error, price) => {
      this.setState({
        transactionPrice: error ? '40' : price.toString() / 1000000000,
      })
    })
  }
  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  setAbi(event) {
    this.setState({ abi: JSON.parse(event.target.value) });
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
            required
            value={this.state.transactionEther}
            onChange={this.setTransactionEther.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Contract ABI:</ControlLabel>
          <FormControl
            type="text"
            placeholder="Contract ABI"
            required
            onChange={this.setAbi.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Contract Address:</ControlLabel>
          <FormControl
            type="text"
            placeholder="Contract Address"
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
          <ControlLabel>Max Spend Gas :{(this.state.transactionPrice / 1000000000 * this.state.transactionLimit).toFixed(18)}</ControlLabel>
        </FormGroup>
        <Button onClick={this.cancelTransaction}>Back Main Page</Button>
        <Button bsStyle="danger" onClick={this.toTransaction}>Deploy SmartContract</Button>


        <PanelGroup
          accordion
          id="accordion-controlled-example"
          activeKey={this.state.activeKey}
          onSelect={this.handleSelect.bind(this)}
        >
          {(() => {
            let panel = []
            for (let index in this.state.abi) {
              if (this.state.abi[index].type !== "constructor") {
                panel.push(
                  <Panel eventKey={index} key={index}>
                    <Panel.Heading>
                      <Panel.Title toggle>{this.state.abi[index].name}</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body collapsible>
                      ...
              </Panel.Body>
                  </Panel>
                )
              }
            }
            return panel
          })()}

        </PanelGroup>
      </Form>
    )
  }
}
