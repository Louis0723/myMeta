import { sha256 } from 'ethereumjs-util';
/** 
* id : sha256(privateKey)
* name : sha256(privateKey) *default
* passwordHash : sha256(password)
* privateKeyHash : aes(password,privateKey)
*/

export function getAccountList(): any {
    let accountList: any = localStorage.getItem('AccountList');
    if (accountList === null) {
        accountList = '{}';
        localStorage.setItem('AccountList', '{}');
    }
    accountList = JSON.parse(accountList)
    return accountList;
}

function setAccountList(accountList): void {
    JSON.parse(JSON.stringify(accountList)); // 防止不是JSON
    localStorage.setItem('AccountList', accountList);
}

export function newAccount(privateKey, password) {
    let account = {
        'id': sha256(privateKey),
        'name': sha256(privateKey),
        'passwordHash': sha256(password),
        'privateKeyHash': privateKey // To Do: AES 加密
    }
}
export function checkMatch(id, password): boolean {
    let accountList = getAccountList();
    // if (accountList[id]) {
    //     return accountList[id].passwordHash === sha256(password);
    // }
    // return false;
    return Boolean(accountList[id]) && accountList[id].passwordHash === sha256(password)
}
export function saveAccount(id, name, password): boolean { // 注意密碼不可更改
    let accountList = getAccountList();
    if (checkMatch(id, password)) {
        accountList[0].name = name;
        setAccountList(accountList);
    } else {
        return false
    }
}

export function getAccount(id, password): any {
    let accountList = getAccountList();
    if (checkMatch(id, password)) {
        accountList[0].privateKey = accountList[0].privateKeyHash // To Do: accountList[0].privateKey = AES解密(accountList[0].privateKeyHash,password)
        return accountList[0];
    }
    return false
}

export function setCurrentEmail(email): void {
    localStorage.setItem('Email', email);
}

export function getCurrentEmail(): string {
    let email = localStorage.getItem('Email');
    return email || '';
}