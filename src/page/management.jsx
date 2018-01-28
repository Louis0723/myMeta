import * as React from 'react';
import {Form, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import UserDomain from "../domain/userDomain";
import {Account} from "../vo/account";
import StorageUtil from "../util/storageUtil";
import * as GibberishAES from 'gibberish-aes/dist/gibberish-aes-1.0.0.min';
import { sha256 } from 'ethereumjs-util';

export class ManagementComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {accountName: '', accountPwd: ''};
	}

	/**
	 * id : sha256(privateKey)
	 * name : sha256(privateKey) *default
	 * password : sha256(password)
	 * privateKey : aes(password,privateKey)
	 */

	render() {
		return (
				<Form>
					<FormGroup>
						<ControlLabel>儲存名稱:</ControlLabel>
						<FormControl
								type="text"
								onChange={this.onChangeAccountName}
								pattern="^[a-z0-9]$"
						/>
					</FormGroup>
					<FormGroup>
						<ControlLabel>儲存密碼:</ControlLabel>
						<FormControl
								type="text"
								onChange={this.onChangeAccountPwd}
								pattern="^[a-z0-9]$"
						/>
					</FormGroup>
					<Button onClick={this.saveAccountToLocalStorage}>儲存此賬戶</Button>
					{/*<Button onClick={this.doTestAES256Btn} >AES測試</Button>*/}
					{/*<Button>Save Account {/Electron/.test(navigator.userAgent)?'':'To This Browser'}</Button>*/}
				</Form>
		);
	}

	doTestAES256Btn() {
		let enc = GibberishAES.enc("This sentence is super secret", "ultra-strong-password");
		alert(enc);
		let decEnc = GibberishAES.dec(enc, "ultra-strong-password");
		alert(decEnc);
	}

	saveAccountToLocalStorage = () => {
		let {accountName,accountPwd} = this.state;
		let loginUser = UserDomain.loginUser;
		let loginType = loginUser.loginType;
		let privateKey = loginUser.privateKey;
		let id = loginUser.id;
		let pwd = loginUser.pwd;
		let accounts = StorageUtil.accounts;

		if(!accountName){
			alert(`請輸入存儲名稱!`);
			return;
		}
		let account = accounts.get(accountName);
		if(account) {
			alert('已存在的存儲名稱!');
			return;
		}{
			account = new Account();
		}
		account.name = accountName;
		account.id = id;
		if (loginType === 'email') {
			accountPwd = pwd;
			let sha256Pwd = sha256(accountPwd);
			account.passwordHash = sha256Pwd.toString('hex');
			account.privateKeyAES = GibberishAES.enc(privateKey, account.passwordHash);
		} else if (loginType === 'privateKey') {
			if(!accountPwd) {
				alert(`請輸入存儲密碼!`);
				return;
			}
			let sha256Pwd = sha256(accountPwd);
			account.passwordHash = sha256Pwd.toString('hex');
			account.privateKeyAES = GibberishAES.enc(privateKey, account.passwordHash);
		} else {
			alert('已存在賬號,無法保存!');
			return;
		}
		accounts.set(account.name, account);
		StorageUtil.accounts = accounts;
		alert('儲存成功!');
	};


	onChangeAccountName = (e) => {
		this.setState({accountName:e.target.value});
	};

	onChangeAccountPwd = (e) => {
		this.setState({accountPwd:e.target.value});
	};

}
