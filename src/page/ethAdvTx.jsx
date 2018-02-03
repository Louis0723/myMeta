import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { Observable } from 'rxjs';
import { outputRawTx, sign, privateKeyStringToBuffer } from '../vo/tx';
import { Form, FormControl, ControlLabel, Button, FormGroup, PanelGroup, Panel, Row, Col } from 'react-bootstrap';
import { ContractBoxComponent } from './smartContractBox'


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
      transactionTo: '0x5a96d6a948aaa5019a1224c46a0d458f3276602a',
      transactionLimit: '3000000',
      transactionPrice: '40',
      abi: [{ "constant": true, "inputs": [], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBettingStatus", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getDeveloperAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "uint256" }], "name": "findWinners", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getMaxContenders", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "getBettingStastics", "outputs": [{ "name": "", "type": "uint256[20]" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getBettingPrice", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getDeveloperFee", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getLotteryMoney", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_contenders", "type": "uint256" }, { "name": "_bettingprice", "type": "uint256" }], "name": "setBettingCondition", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "state", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guess", "type": "uint256" }], "name": "addguess", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "finish", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "uint256" }], "name": "setStatusPrice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "money", "type": "uint256" }, { "indexed": false, "name": "guess", "type": "uint256" }, { "indexed": false, "name": "gameindex", "type": "uint256" }, { "indexed": false, "name": "lotterynumber", "type": "uint256" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "SentPrizeToWinner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "balance", "type": "uint256" }], "name": "SentDeveloperFee", "type": "event" }],
    }
    this.props.web3.eth.getGasPrice((error, price) => {
      this.setState({
        transactionPrice: error ? '40' : price.toString() / 1000000000,
      })
    })
  }
  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  setAbi(event) {
    try {
      let abi = JSON.parse(event.target.value)
      this.setState({ abi: abi });
    } catch (e) { }
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
  sendTransaction(payload) {
    if (this.state.address && this.state.transactionEther && this.state.transactionLimit && this.state.transactionPrice && this.state.transactionTo) {
      let param = {
        from: this.state.address,
        to: this.state.transactionTo,
        ether: this.props.web3.toWei(this.state.transactionEther),
        gasLimit: this.state.transactionLimit,
        gasPrice: this.state.transactionPrice * 1000000000,
        payloadData: payload
      }
      console.log('param', param)
      let tx = outputRawTx(param)
      let txSigned = sign(privateKeyStringToBuffer(this.state.privateKey), tx);
      return txSigned
    }
  }
  componentWillUnmount() { }
  render() {
    let panel = []
    for (let index in this.state.abi) {
      if (this.state.abi[index].type !== "constructor") {
        panel.push(
          <ContractBoxComponent
            abi={this.state.abi[index]}
            index={index}
            key={index}
            parentState={this.state}
            sendTransaction={this.sendTransaction.bind(this)}
            web3={this.props.web3}
          />
        )
      }
    }

    return (
      <div>
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
          <Row>
            <Col xs={6}>
              <FormGroup>
                <ControlLabel>Contract ABI:</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Contract ABI"
                  required
                  onChange={this.setAbi.bind(this)}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
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
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
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
            </Col>
            <Col xs={6}>
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
            </Col>
          </Row>
          <FormGroup>
            <ControlLabel>Max Spend Gas :{(this.state.transactionPrice / 1000000000 * this.state.transactionLimit).toFixed(18)}</ControlLabel>
          </FormGroup>
          <FormGroup>
          <Button onClick={this.cancelTransaction}>Back Main Page</Button>
          <Button bsStyle="danger" onClick={this.toTransaction}>Deploy SmartContract</Button>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Function:</ControlLabel>
            <PanelGroup
              style={{ "overflowY": "scroll", "mixHeight": "200px" }}
              accordion
              id="accordion-controlled-example"
              activeKey={this.state.activeKey}
              onSelect={this.handleSelect.bind(this)}
            >
              {panel}
            </PanelGroup>
          </FormGroup>
        </Form>
      </div>
    )
  }
}
