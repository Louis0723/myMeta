import Account from '../vo/account';

class UserDomain_ {
    loginUser: Account = null;
    // * id : sha256(privateKey)
    // * name : sha256(privateKey) *default
    // * passwordHash : sha256(password)
    // * privateKeyAES : aes(password,privateKey)
}

const UserDomain = new UserDomain_();
export default UserDomain;