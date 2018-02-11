import {observable, computed} from "mobx";
import {observer} from "mobx-react";

/*頂層狀態容器*/
export class TopState{
	appState: AppState;
	loginState: LoginState;
}

export class AppState {

}
export class LoginState {
	@observable
	privateKey = '';
	@observable
	email = '';
	@observable
	password = '';
	@observable
	privateKeyByPwd = '';
	@observable
	privateKeyInput = '';
	@observable
	passwordType = 'password';
	@observable
	loginType = 'email';
	@observable
	account = '';
	@observable
	accountPwd = '';
}
