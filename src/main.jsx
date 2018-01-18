
import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import { Tabs, Tab } from 'react-bootstrap';
import { EthMainComponent } from './ethMain'
import { BtcMainComponent } from './btcMain'
import { SettingComponent } from './setting'


export class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    let web3 = new Web3();
    // web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/metamask'))
    web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/Uw7vEslp5bpgqPgNkm05'));
    window.web3 = web3
    this.state = {
      privateKey: this.props.privateKey,
      web3: web3,
    }
  }
  render() {
    return (
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Ethereum">
          <EthMainComponent privateKey={this.state.privateKey} web3={web3} />
        </Tab>
        <Tab eventKey={2} title="Bitcoin">
          <BtcMainComponent privateKey={this.state.privateKey} />
        </Tab>
        <Tab eventKey={3} title="Setting" >
          <SettingComponent />
	      </Tab>
      </Tabs>
    )
  }
}