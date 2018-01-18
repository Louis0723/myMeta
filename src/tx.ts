import * as _ from 'lodash';
import * as Web3 from './web3';
import * as EthereumTx from 'ethereumjs-tx';
import * as SolidityFunction from './web3/lib/web3/function';
import * as wallet from 'ethereumjs-wallet';
import { sha256 } from 'ethereumjs-util';
import * as bs58 from 'bs58';
import {
  Buffer
} from 'buffer';


let web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/Uw7vEslp5bpgqPgNkm05'))

export function outputPayload(abi, contractName, ether = '', ...args) {
  let solidityFunction = new SolidityFunction(ether, _.find(abi, {
    name: contractName
  }));
  let payloadData = solidityFunction.toPayload(args).data;
  return payloadData;
}


export function outputRawTx({ from, to = null, ether, gasLimit, gasPrice, payloadData = null }): EthereumTx {
  let nonce = web3.eth.getTransactionCount(from);
  let nonceHex = web3.toHex(nonce);
  // let gasPrice = web3.eth.gasPrice;
  let etherHex = web3.toHex(ether);
  let gasLimitHex = web3.toHex(gasLimit);
  let gasPriceHex = web3.toHex(gasPrice);

  let rawTx: any = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    from: from,
    value: etherHex,
  };
  to && (rawTx.to = to);
  payloadData && (rawTx.data = payloadData);

  return new EthereumTx(rawTx);
}


export function sign(privateKeyBuffer: Buffer, tx: EthereumTx): string {
  tx.sign(privateKeyBuffer);
  let serializedTx = tx.serialize();
  return `0x${serializedTx.toString('hex')}`
}


export function privateKeyStringToBuffer(privateKeyString): Buffer {
  return new Buffer(privateKeyString, 'hex')
}

export function parseWIF(privateKeyBuffer: Buffer): Buffer {
  let wif = [].concat(...<any>privateKeyBuffer);
  wif.push(0x01);
  wif.unshift(0x80);
  var hash = sha256(sha256(wif));
  var checksum = hash.slice(0, 4);
  wif = wif.concat(...checksum);
  return bs58.encode(wif);
}


export function makePrivateKey(email: string, password: string) {
  /* from coinb.in */
  let s = email;
  s += '|' + password + '|';
  s += s.length + '|!@' + ((password.length * 7) + email.length) * 7;
  let regchars = (password.match(/[a-z]+/g)) ? password.match(/[a-z]+/g).length : 1;
  let regupchars = (password.match(/[A-Z]+/g)) ? password.match(/[A-Z]+/g).length : 1;
  let regnums = (password.match(/[0-9]+/g)) ? password.match(/[0-9]+/g).length : 1;
  s += ((regnums + regchars) + regupchars) * password.length + '3571';
  s += (s + '' + s);
  for (let i = 0; i <= 51; i++) {
    s = sha256(s).toString('hex');
  };

  return s;
}
