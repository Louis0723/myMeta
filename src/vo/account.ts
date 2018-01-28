import { sha256 } from 'ethereumjs-util';


export class User {
    privateKey:string;//私鑰
    loginType:string;//登入模式
    account:Account = new Account;//永久存儲用
}

export class Account {
    id:string;           //  * id : sha256(privateKey)
    name: string;        //  * name : sha256(privateKey) *default
    passwordHash:string; //  * passwordHash : sha256(password)
    privateKeyAES:string;//  * privateKeyAES : aes(password,privateKey)
}
