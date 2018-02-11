import * as React from 'react';
import * as wallet from 'ethereumjs-wallet';
import {Tabs, Tab} from 'react-bootstrap';
import {EthMainComponent} from './ethMain'
import {BtcMainComponent} from './btcMain'
import {ManagementComponent} from './management';
import {env} from '../vo/env'
import * as Web3 from '../web3/';
import {TopState} from "../vo/state/top_state";
import {observer} from "mobx-react";

@observer
export class MainComponent extends React.Component {
	topState:TopState;
	web3: Web3;
	constructor(props) {
		super(props);
		this.topState = props.topState;
		this.web3 = new Web3();
		this.web3.setProvider(new Web3.providers.HttpProvider(env.ethUrl));
		// web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/metamask'))
		// window.web3 = web3;
	}

	render() {
		let topState = this.topState;
		let loginState = topState.loginState;
		let privateKey = loginState.privateKey;
		return (
				<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
					<Tab eventKey={1} title="Ethereum">
						<EthMainComponent privateKey={privateKey} web3={this.web3}/>
					</Tab>
					<Tab eventKey={2} title="Bitcoin" disabled>
						<BtcMainComponent privateKey={privateKey}/>
					</Tab>
					<Tab eventKey={3} title="Setting">
						<ManagementComponent topState={topState}/>
					</Tab>
				</Tabs>
		)
	}
}