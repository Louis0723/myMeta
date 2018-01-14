import * as _ from 'lodash';
import * as Web3 from './web3';
import * as EthereumTx from 'ethereumjs-tx';
import * as SolidityFunction from './web3/lib/web3/function';
import * as wallet from 'ethereumjs-wallet';


let web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/Uw7vEslp5bpgqPgNkm05'))

export function outputPayload(abi, contractName, ether = '', ...args) {
  let solidityFunction = new SolidityFunction(ether, _.find(abi, {
    name: contractName
  }));
  let payloadData = solidityFunction.toPayload(args).data;
  return payloadData;
}


export function outputRawTx(from, to, payloadData, ether = '0x00') {
  let nonce = web3.eth.getTransactionCount(from);
  let nonceHex = web3.toHex(nonce);
  let gasPrice = web3.eth.gasPrice;
  let gasPriceHex = web3.toHex(gasPrice);
  let gasLimitHex = web3.toHex(300000);

  let rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    to: to,
    from: from,
    data: payloadData,
    value: ether,
  };
  return new EthereumTx(rawTx);
}


export function sign(privateKeyBuffer, tx) {
  tx.sign(privateKeyBuffer);
  let serializedTx = tx.serialize();
  return `0x${serializedTx.toString('hex')}`
}


export function privateKeyStringToBuffer(privateKeyString) {
    return new Buffer(privateKeyString,'hex')
}
