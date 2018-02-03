import * as React from 'react';
import { Button, Panel, Form, Table, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { ParamInputComponent } from './paramInput';
import { outputPayload } from '../vo/tx';
import { env } from '../vo/env';
import { Observable } from 'rxjs';
import * as ajax from '@fdaciuk/ajax';

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


    this.eventtr = [];
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
      }).catch().retry()

      this.sub = ob.subscribe((data) => {
        this.setState({ outputResult: JSON.parse(JSON.stringify(data, null, 2)) })
      })
    }

  }
  componentWillUnmount() {
    try {
      this.sub.unsubscribe();
      console.log('try', this.sub);
    } catch (e) {
      console.log('catch', this.sub);
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
        let temp = Observable.interval(3000).map(() => {
          return this.props.web3.eth.getTransactionReceipt(txid)
        }).filter(data => data).first().subscribe(data => {
          this.setState({ transactionBlock: data.blockNumber, transactionContractAddress: data.contractAddress || 'fails' })
          temp.unsubscribe();
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
    let output = [];
    if (this.props.abi.outputs && this.props.abi.outputs.length) {
      for (let index in this.props.abi.outputs) {
        output.push(<tr key={index}><td>{this.props.abi.outputs[index].name && this.props.abi.outputs[index].name + '-'}{this.props.abi.outputs[index].type}</td>
          <td>{this.props.abi.outputs.length > 1 ? this.state.outputResult[index] : this.state.outputResult}</td></tr>

        )
      }
    }
    
    if (this.props.abi.type === 'event') {
      let contract = this.props.web3.eth.contract(this.state.parent.abi);
      let contractInstance = contract.at(this.state.parent.transactionTo);
      let eventObject=contractInstance[this.props.abi.name](null, { fromBlock: 0, toBlock: 'latest' });
      let filter=encodeURI(JSON.stringify([eventObject.options]));
      let request = ajax().get(`${env.filterUrl}/eth_getLogs?params=${filter}`)
      
      //debugger
      request.then((data)=>{
        let results=data.result;
        if(!results)return;
        for(let index in results){
          let dataArray=results[index].data.match(/[a-f0-9]{64}/g);
          let eventtd = [];
          for(let key in this.props.abi.inputs){
            let input=this.props.abi.inputs[key];
            if(/int/.test(input.type)){
              let data= parseInt(`0x${dataArray[key]}`)
              eventtd.push(<td key={key}>{data}</td>);
            }else if(/address/.test(input.type)){
              let address='0x'+(/[^0].+$/.exec(dataArray[key])[0].padStart('0',40));
              eventtd.push(<td key={key}>{address}</td>);
            }else{
              eventtd.push(<td key={key}>{dataArray[key]}</td>);
            }
          }
          this.eventtr[index] = (<tr key={index}>{eventtd}</tr>);
        }
      })
      // eventObject.watch((e,r)=>{
      //   debugger
      //   if(e)return;
      //   result=JSON.parse(JSON.stringify(r));
      //   console.log('event result',result);
      //   let eventtd=[];
      //   for(let i=0;i<result.args.length;i++){
      //     eventtd.push(<td key={i}>{result.args[i]}</td>)
      //   }
      //   eventtr.push(<td key={trcount}>{eventtd}</td>);
      //   trcount++
      // })
    }
    return (
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
              } else if (this.props.abi.type === 'event') {
                let theadtd = [];
                for (let index in this.props.abi.inputs) {
                  theadtd.push(<th key={index}>{this.props.abi.inputs[index].name}</th>)
                }
                return (
                  <Table striped bordered condensed hover>
                    <thead><tr>{theadtd}</tr></thead>
                    <tbody>{this.eventtr}</tbody>
                  </Table>)
              }
            })()
          }
        </Panel.Body>
      </Panel>
    )
  }
}