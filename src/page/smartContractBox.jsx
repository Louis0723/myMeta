import * as React from 'react';
import { Button, Panel, Form, Table, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { ParamInputComponent } from './paramInput';
import { outputPayload } from '../vo/tx';
import { Observable } from 'rxjs';

export class ContractBoxComponent extends React.Component {
  constructor(props) {
    super(props)
    let parent = JSON.parse(JSON.stringify(this.props.parentState))
    this.state = {
      transactionTxid: '',
      transactionBlock: 'Wait...',
      params: [],
      parent: parent,
      outputResult: []
    }



    let ob;
    if (this.props.abi.type !== 'event' && this.props.abi.outputs.length > 0) {
      let contract = this.props.web3.eth.contract(this.props.parentState.abi);
      this.contractInstance = contract.at(this.props.parentState.transactionTo);
      ob = Observable.interval(3000).mergeMap(() => {
        return Observable.create((obser) => {
          try {
            this.contractInstance[this.props.abi.name].call(...this.state.params, (e, r) => {
              e && obser.error(e)
              e || obser.next(r)
              obser.complete();
            })
          } catch (e) { obser.complete() }
        })
      }).catch().retry().subscribe((data) => {
        this.setState({ outputResult: JSON.parse(JSON.stringify(data, null, 2)) })
      })
    }

  }
  // shouldComponentUpdate(nextProps){
  //   // try{
  //   //   if(this.state.parent.transactionTo!==nextProps.parentState.transactionTo || this.state.parent.abi !==nextProps.parentState.abi){
  //   //     let contract = this.props.web3.eth.contract(nextProps.parentState.abi);
  //   //     this.contractInstance = contract.at(nextProps.parentState.transactionTo);
  //   //   }
  //   // }catch(e){
  //   //   console.log(this.state)
  //   // }
  //   // return false
  // }
  componentWillReceiveProps(nextProps) {
    // console.log('A',this.state.parent ,nextProps.parentState,this.props.abi,'B' )

    if (this.state.parent.transactionTo !== nextProps.parentState.transactionTo || this.state.parent.abi !== nextProps.parentState.abi) {
      let contract = this.props.web3.eth.contract(nextProps.parentState.abi);
      this.contractInstance = contract.at(nextProps.parentState.transactionTo);
    }

    return false

    this.setState({
      parent: this.props.nextProps
    })
  }

  setParamValue(id, tag) {
    this.state.params[id] = tag.getValue();
    this.setState({ params: this.state.params });
    // console.log(this.state.params, tag, id)
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
    let output = []
    if (this.props.abi.outputs && this.props.abi.outputs.length) {

      for (let index in this.props.abi.outputs) {
        output.push(<tr key={index}><td>{this.props.abi.outputs[index].name && this.props.abi.outputs[index].name + '-'}{this.props.abi.outputs[index].type}</td>
          <td>{this.props.abi.outputs.length > 1 ? this.state.outputResult[index] : this.state.outputResult}</td></tr>

        )
      }
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
                      <tbody>{output}</tbody>
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