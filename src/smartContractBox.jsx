import * as React from 'react';
import { Button, Panel, Form, Table, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { ParamInputComponent } from './paramInput';
import { outputPayload } from './tx';
import { Observable } from 'rxjs';

export class ContractBoxComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transactionTxid: '',
      transactionBlock: 'Wait...',
      params: [],
      parent: this.props.state
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      parent: this.props.nextProps
    })
  }

  setParamValue(id, tag) {
    this.state.params[id] = tag.getValue();
    this.setState({ params: this.state.params });
    console.log(this.state.params, tag, id)
  }

  sendTransaction() {
    console.log(this.state.params)
    let payload = outputPayload(this.props.abi, this.props.parentState.ether, this.state.params)
    console.log(payload)
    let txSigned = this.props.sendTransaction(payload)
    console.log(this.props.sendTransaction)
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

  render() {
    let inputs = [];
    if (this.props.abi.inputs && this.props.abi.inputs.length && this.props.abi.type !== 'event') {
      for (let index in this.props.abi.inputs) {
        let input = this.props.abi.inputs[index];
        let type = /int/.test(input.type) ? 'Integer' : 'String';
        inputs.push(<ParamInputComponent key={index} index={index} type={type} lock={true} setParamValue={this.setParamValue.bind(this)} />)
      }
    }
    let send = [];
    if (!this.props.abi.constant && this.props.abi.type !== 'event') {
      send.push(<Button key={0} onClick={this.sendTransaction.bind(this)}>Send Transaction</Button>)

    }
    return (
      <Form>
        <Panel eventKey={this.props.index}>
          <Panel.Heading>
            <Panel.Title toggle>{this.props.abi.name}</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            {inputs}
            {send}
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
            {
              (() => {
                if (this.props.abi.outputs && this.props.abi.outputs.length) {
                  return (
                    <Table striped bordered condensed hover>
                      <thead><tr><th>Output</th><th>Call</th></tr></thead>
                    </Table>)
                }
              })()
            }

          </Panel.Body>
        </Panel>
      </Form>
    )
  }
}