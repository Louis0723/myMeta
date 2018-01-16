
import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { sha256 } from 'ethereumjs-util';
import { Tabs, Tab, Label } from 'react-bootstrap';
import { EthMainComponent } from './ethMain'
import { BtcMainComponent } from './btcMain'


export class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: this.props.privateKey
    }
  }
  render() {
    return (
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Ethereum">
          <EthMainComponent privateKey={this.state.privateKey} />
        </Tab>
        <Tab eventKey={2} title="Bitcoin">
          <BtcMainComponent privateKey={this.state.privateKey} />
        </Tab>
        <Tab eventKey={3} title="Litecoin" disabled>
          Tab 3 content
	      </Tab>
      </Tabs>
    )
  }
}