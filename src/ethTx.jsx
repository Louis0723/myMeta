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

  }
  render() {
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
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${this.state.transactionTxid}`}>
                      <FormControl value={this.state.transactionTxid} disabled />
                    </a>
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
                    <a target="_blank" href={`https://ropsten.etherscan.io/block/${this.state.transactionBlock}`}>
                      {this.state.transactionBlock === "Wait..." ? "Wait..." : <FormControl value={this.state.transactionBlock} disabled />}
                    </a>
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
