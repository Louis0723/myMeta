import {User} from '../vo/account';

class UserDomain_ {
    loginUser: User = null;
    // * id : sha256(privateKey)
    // * name : sha256(privateKey) *default
    // * passwordHash : sha256(password)
    // * privateKeyAES : aes(password,privateKey)
}

const UserDomain = new UserDomain_();
export default UserDomain;