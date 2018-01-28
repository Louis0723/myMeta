import { sha256 } from 'ethereumjs-util';


class Account {
    id:string;           //  * id : sha256(privateKey)
    name: string;        //  * name : sha256(privateKey) *default
    password:string; //  * passwordHash : sha256(password)
    privateKey:string;//  * privateKeyAES : aes(password,privateKey)
    passwordHash:string; //  * passwordHash : sha256(password)
    privateKeyAES:string;//  * privateKeyAES : aes(password,privateKey)
    loginType:string;//登入模式
}

export default Account;
