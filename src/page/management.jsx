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
		let loginUser = UserDomain.loginUser;
		let loginType = loginUser.loginType;
		return (
				<Form onSubmit={this.saveAccountToLocalStorage}>
					<FormGroup>
						<ControlLabel>儲存名稱:</ControlLabel>
						<FormControl
								type="text"
								onChange={this.onChangeAccountName}
						/>
					</FormGroup>
					{loginType==='email'?'':(<div>
						<FormGroup>
							<ControlLabel>儲存密碼:</ControlLabel>
							<FormControl
									type="password"
									onChange={this.onChangeAccountPwd}
									pattern="^.{8,}$"
							/>
						</FormGroup>
					</div>)}
					<Button type="submit">儲存此賬戶</Button>
					<Button onClick={this.clearAccountToLocalStorage}>清除此賬戶</Button>
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

	saveAccountToLocalStorage = (event) => {
		event.preventDefault();
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
		}else {
			account = new Account();
		}
		account.name = accountName;
		account.id = id;
		if (loginType === 'email') {
			accountPwd = pwd;
			let sha256Pwd = sha256(accountPwd);
			account.passwordHash = sha256Pwd.toString('hex');
			account.privateKeyAES = GibberishAES.enc(privateKey, account.passwordHash);
		} else if (loginType === 'private_key') {
			if(!accountPwd) {
				alert(`請輸入存儲密碼!`);
				return;
			}
			let sha256Pwd = sha256(accountPwd);
			account.passwordHash = sha256Pwd.toString('hex');
			account.privateKeyAES = GibberishAES.enc(privateKey, account.passwordHash);
		} else if(loginType === 'local_storage'){
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


	clearAccountToLocalStorage = () => {
		let {accountName,accountPwd} = this.state;
		let accounts = StorageUtil.accounts;
		let account = accounts.get(accountName);
		if(!account) {
			alert('指定名稱賬號不存在無法清除!');
			return;
		}
		accounts.delete(accountName);
		StorageUtil.accounts = accounts;
		alert('清除名稱記錄成功!');
	};

	onChangeAccountName = (e) => {
		this.setState({accountName:e.target.value});
	};

	onChangeAccountPwd = (e) => {
		this.setState({accountPwd:e.target.value});
	};

}
