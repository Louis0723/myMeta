import { outputPayload, outputRawTx, sign, privateKeyStringToBuffer, parseWIF } from './tx';
import * as Web3 from './web3';

let web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/Uw7vEslp5bpgqPgNkm05'))
let abi = [{ 'constant': true, 'inputs': [{ 'name': '', 'type': 'bytes32' }], 'name': 'votesReceived', 'outputs': [{ 'name': '', 'type': 'uint8' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'candidate', 'type': 'bytes32' }], 'name': 'validCandidate', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'candidate', 'type': 'bytes32' }], 'name': 'totalVotesFor', 'outputs': [{ 'name': '', 'type': 'uint8' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': '', 'type': 'uint256' }], 'name': 'candidateList', 'outputs': [{ 'name': '', 'type': 'bytes32' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'candidate', 'type': 'bytes32' }], 'name': 'voteForCandidate', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'name': 'candidateNames', 'type': 'bytes32[]' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }]
let walletContractAddress = '0x9a740465Ac6A2Ef11e3b10BeE5249825f5B8Dedd';
let account = '0x075AF3488f386D0E9c2CD43f58b78F2bA13D9c92';
let privateKeyString = 'daac1435cdd5a4aece27643f4ac287a6dadbf56b5ce0bb0b29d41d6ba5b612be';



let payload = outputPayload(abi, 'voteForCandidate', '0', 'Alice');
// let tx = outputRawTx(account, walletContractAddress, '0', payload);
// let bufferKey = privateKeyStringToBuffer(privateKeyString);
// let txSigned = sign(bufferKey, tx);
// console.log('wif', parseWIF(bufferKey))




// web3.eth.sendRawTransaction(txSigned, function (err, hash) {
//   if (err) {
//     console.log('Error:');
//     console.log(err);
//   }
//   else {
//     console.log('Transaction receipt hash pending');
//     console.log(hash);
//   }
// });