import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { Observable } from 'rxjs';
import { outputRawTx, sign, privateKeyStringToBuffer ,createContractPayload } from './tx';
import { Form, FormControl, ControlLabel, Button, FormGroup, ButtonGroup } from 'react-bootstrap';
import { ParamInputComponent } from './paramInput'


export class EthDeploySmartContractComponent extends React.Component {
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
      transactionData: '0x',
      transactionLimit: '3000000',// 比 ethTx 多一個0
      transactionPrice: '40',
      transactionTxid: '',
      transactionBlock: 'Wait...',
      transactionContractAddress: 'Wait...',
      params: [],
      paramInput: [],
      abi:[],
    }
    this.props.web3.eth.getGasPrice((error, price) => {
      this.setState({
        transactionPrice: error ? '40' : price.toString() / 1000000000,
      })
    })
  }


  setAbi(event) {
    this.setState({ abi: JSON.parse(event.target.value) });
  }
  setParamValue(id, tag) {
    this.state.params[id] = tag.getValue();
    this.setState({ params: this.state.params });
    console.log(this.state.params)
  }

  setParamNumber(event) {
    let num = Number(event.target.value)
    num = num > 100 ? 99 : num
    num = num < -1 ? 0 : num
    let paramInput = []
    for (let i = 0; i < num; i++) {
      paramInput.push(<ParamInputComponent key={i} index={i} setParamValue={this.setParamValue.bind(this)} />)
    }
    this.setState({ paramInput: paramInput });
    this.state.params.length = num;
    this.setState({ params: this.state.params });
  }
  setTransactionEther(event) {
    this.setState({ transactionEther: event.target.value });
  }
  setTransactionData(event) {
    event.target.value = /^0x/.test(event.target.value) ? event.target.value : '0x' + event.target.value;
    this.setState({ transactionData: event.target.value });
  }
  setTransactionLimit(event) {
    this.setState({ transactionLimit: event.target.value });
  }
  setTransactionPrice(event) {
    this.setState({ transactionPrice: event.target.value });
  }
  sendTransaction() {
    if (this.state.address && this.state.transactionData && this.state.transactionEther && this.state.transactionLimit && this.state.transactionPrice) {
      let payload=createContractPayload(this.state.abi,this.state.transactionData,this.state.params);
      let param = {
        from: this.state.address,
        ether: this.props.web3.toWei(this.state.transactionEther),
        gasLimit: this.state.transactionLimit,
        gasPrice: this.state.transactionPrice * 1000000000,
        payloadData: payload
      }
      let tx = outputRawTx(param)
      let txSigned = sign(privateKeyStringToBuffer(this.state.privateKey), tx);
      this.props.web3.eth.sendRawTransaction(txSigned, (err, txid) => {
        if (err) {
          console.log(err);
        }
        else {
          this.setState({ transactionTxid: txid, transactionBlock: 'Wait...', transactionContractAddress: 'Wait...' })
          Observable.interval(3000).map(() => {
            return this.props.web3.eth.getTransactionReceipt(txid)
          }).filter(data => data).first().subscribe(data => {
            this.setState({ transactionBlock: data.blockNumber, transactionContractAddress: data.contractAddress || 'fails' })
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
          <ControlLabel>Contract Byte Code:</ControlLabel>
          <FormControl
            type="text"
            placeholder="Contract Byte Code"
            value={this.state.transactionData}
            required
            onChange={this.setTransactionData.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Gas Limit:</ControlLabel>
          <FormControl
            type="number"
            placeholder=""
            value={this.state.transactionLimit}
            required
            onChange={this.setTransactionLimit.bind(this)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Gas Price(Gwei):</ControlLabel>
          <FormControl
            type="number"
            placeholder=""
            value={this.state.transactionPrice}
            required
            onChange={this.setTransactionPrice.bind(this)}
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
        <FormGroup>
          {(() => {
            if (this.state.transactionTxid) {
              return (
                <div>
                  <ControlLabel>ContractAddress:</ControlLabel>
                  {this.state.transactionContractAddress === "Wait..." ?
                    <FormControl value="Wait..." disabled /> :
                    <a target="_blank" href={`https://ropsten.etherscan.io/address/${this.state.transactionContractAddress}`}>
                      <FormControl value={this.state.transactionContractAddress} disabled />
                    </a>}
                </div>
              )
            }
          })()
          }
        </FormGroup>
        <FormGroup>
          <ControlLabel>Param Number:</ControlLabel>
          <FormControl
            max="99"
            min="0"
            type="number"
            placeholder="Param Number"
            onChange={this.setParamNumber.bind(this)}
          />
        </FormGroup>

        {this.state.paramInput}
        <ButtonGroup>
          <Button onClick={this.cancelTransaction}>Back Main Page</Button>
          <Button bsStyle="primary" onClick={this.sendTransaction.bind(this)}>Send Transaction</Button>
        </ButtonGroup>
      </Form>
    )
  }
}
