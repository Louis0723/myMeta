import {Account, StorageAccounts} from "../vo/account";

class StorageUtil_ {

	/*賬號儲存*/
	get accounts():StorageAccounts
	{
		let storageAccounts:StorageAccounts = new StorageAccounts();
		let item_str = localStorage.getItem('accounts');
		if(!item_str)
			return storageAccounts;
		let item_obj = JSON.parse(item_str);
		for(let key in item_obj) {
			let obj = item_obj[key];
			let account = new Account();
			account = Object.assign(account, obj);
			storageAccounts.set(key,account);
		}
		return storageAccounts;
	}
	set accounts(storageAccounts:StorageAccounts){
		let ro = {};
		storageAccounts.forEach((value,key) => {
			ro[key] = value;
		});
		let parseStorageAccounts = JSON.stringify(ro);
		localStorage.setItem('accounts',parseStorageAccounts);
	}
	/*賬號儲存*/

}

const StorageUtil = new StorageUtil_();
export default StorageUtil;