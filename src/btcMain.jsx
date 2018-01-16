import * as React from 'react';
import { parseWIF } from './tx';

import { Tabs, Tab, Label } from 'react-bootstrap';
import { Observable } from 'rxjs'
import { ECPair } from 'bitcoinjs-lib'


export class BtcMainComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    let priv = props.privateKey;
    let wif = parseWIF(new Buffer(props.privateKey, 'hex'));
    console.log(wif)
    let ecPair = ECPair.fromWIF(wif)
    let address = ecPair.getAddress()
    let publicKeyBuffer = ecPair.getPublicKeyBuffer()
    let publicKey = publicKeyBuffer.toString('hex')
    console.log(publicKey)
    this.state = {
      privateKey: priv,
      wif: wif,
      address: address,
      publicKey: publicKey,
      balance: '0.00000000'
    }
    this.getBalanceOb = Observable.interval(3000).mergeMap(() => {
      return Observable.create((observer) => {
        jQuery.ajax({
          url: `https://blockchain.info/q/addressbalance/${this.state.address}`,
          error: (error) => {
            observer.error(error);
            observer.complete();
          },
          success:
            (body, res) => {
              observer.next(body);
              observer.complete();
            }
        })
      })
    })
    this.getBalanceObSub = this.getBalanceOb.subscribe((data) => {
      data = data.padStart(9, '0');
      data = data.replace(/(\d{8})$/, '.$1');
      this.setState({ balance: data });
    })

  }
  
  componentWillUnmount() {
    this.getBalanceObSub.unsubscribe();
    this.getBalanceObSub.remove();
  }

  render() {
    return (
      <div>
        <div>address:{this.state.address}</div>
        <div>publicKey:{this.state.publicKey}</div>
        <div>wif:{this.state.wif}</div>
        <div>balance:{this.state.balance}</div>
      </div>

    )
  }
}