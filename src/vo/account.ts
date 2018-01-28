
export class User {
	privateKey: string;//私鑰
	id: string;//賬號
	pwd: string;//密碼
	loginType: string;//登入模式
	account: Account = new Account;//永久存儲用
}

export class StorageAccounts extends Map implements Map<string, Account> {
	//強制形別
}

export class Account {
	name: string;//標識賬號
	id: string;//賬號名稱
	passwordHash: string; //  * passwordHash : sha256(password)
	privateKeyAES: string;//  * privateKeyAES : aes(password,privateKey)
}

export default User;