import {Account} from '../vo/account';
import { sha256 } from 'ethereumjs-util';

class AccountUtil_ {

	getAccountList(): any {
		let accountList: any = localStorage.getItem('AccountList');
		if (accountList === null) {
			accountList = '{}';
			localStorage.setItem('AccountList', '{}');
		}
		accountList = JSON.parse(accountList)
		return accountList;
	};

	//
	setAccountList(accountList): void {
		JSON.parse(JSON.stringify(accountList)); // 防止不是JSON
		localStorage.setItem('AccountList', accountList);
	};


	encodeAccount(privateKey, password): Account {

		let account = new Account();
		// account.
		// let account = {
		// 	'id': sha256(privateKey),
		// 	'name': sha256(privateKey),
		// 	'passwordHash': sha256(password),
		// 	'privateKeyHash': privateKey // To Do: AES 加密
		// }
		return account;
	}

	checkMatch(id, password): boolean {
		let accountList = this.getAccountList();
		// if (accountList[id]) {
		//     return accountList[id].passwordHash === sha256(password);
		// }
		// return false;
		return Boolean(accountList[id]) && accountList[id].passwordHash === sha256(password)
	}

	saveAccount(id, name, password): boolean { // 注意密碼不可更改
		let accountList = this.getAccountList();
		if (this.checkMatch(id, password)) {
			accountList[0].name = name;
			this.setAccountList(accountList);
		} else {
			return false
		}
	}

	getAccount(id, password): any {
		let accountList = this.getAccountList();
		if (this.checkMatch(id, password)) {
			accountList[0].privateKey = accountList[0].privateKeyHash // To Do: accountList[0].privateKey = AES解密(accountList[0].privateKeyHash,password)
			return accountList[0];
		}
		return false
	};

	setCurrentEmail(email): void {
		localStorage.setItem('Email', email);
	}

	getCurrentEmail(): string {
		let email = localStorage.getItem('Email');
		return email || '';
	}
}

const AccountUtil = new AccountUtil_();
export default AccountUtil;