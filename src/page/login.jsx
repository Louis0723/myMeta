import * as React from 'react';
import { makePrivateKey } from '../vo/tx';
import {
  Form, FormControl, ControlLabel, Button, FormGroup, InputGroup, Radio,
  ToggleButtonGroup, ToggleButton, Checkbox
} from 'react-bootstrap';
import { User } from '../vo/account';
import * as GibberishAES from 'gibberish-aes/dist/gibberish-aes-1.0.0.min';
import { sha256 } from 'ethereumjs-util';
import StorageUtil from "../util/storageUtil";
import { AlertComponent } from '../util/alert'


export class LoginComponent extends React.Component {

  constructor(props) {
    super(props);
    let lastLoginID = localStorage.getItem('userLoginID') || '';
    this.state = {
      email: lastLoginID,
      password: '',
      privateKeyByPwd: '',
      privateKeyInput: '',
      passwordType: 'password',
      loginType: 'email',
      account: '',
      accountPwd: '',
      // address: ''
    };
    this.saveEmailFlag = null;
  }

  makePrivateKey() {
    let priv = makePrivateKey(this.state.email, this.state.password);
    this.setState({ privateKeyByPwd: priv });
    // this.setState({ address: address });
  }

  setEmail(e) {
    this.setState({ email: e.target.value }, this.makePrivateKey);
  }

  setPassword(e) {
    this.setState({ password: e.target.value }, this.makePrivateKey);
  }

  setPrivateKey(e) {
    // this.state.email && this.setState({ email: '' });
    // this.state.password && this.setState({ password: '' });
    this.setState({ privateKeyInput: e.target.value });

    if (e.target.value.length === 64 || e.target.value.length === 66) {
      if (/^(0x)?([a-f0-9]{64})$/g.test(e.target.value)) {
        let priv = e.target.value.substring(e.target.value.length - 64);
        this.setState({ privateKeyInput: priv });
      } else {
        this.setState({ address: '' });
        return;
      }
    }
  }

  loginBtn(event) {
    event.preventDefault();
    let email = this.state.email;
    let password = this.state.password;
    let loginType = this.state.loginType;
    let privateKey = null;
    let user = new User();
    if (loginType === 'email') {
      /*檢查賬號密碼格式*/
      if (email !== '' && password !== '') {
        if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email))) {
          return;
        }
        if (!(/.{8,}/.test(password))) {
          return;
        }
      } else if (Number(email === '') ^ Number(password === '')) {
        return;
      }
      /*檢查賬號密碼格式*/
      let saveEmailFlag = this.saveEmailFlag;
      if (saveEmailFlag) {
        localStorage.setItem('userLoginID', email);
      }
      privateKey = this.state.privateKeyByPwd;
      user.id = email;
      user.privateKey = privateKey;
      user.pwd = password;
      user.loginType = loginType;
    } else if (loginType === 'private_key') {
      /*檢查金鑰登入方式*/
      privateKey = this.state.privateKeyInput;
      /*檢查金鑰登入方式*/
      user.privateKey = privateKey;
      user.loginType = loginType;
    } else if (loginType === 'local_storage') {
      let account = this.state.account;
      let accountPwd = this.state.accountPwd;
      let sha256Pwd = sha256(accountPwd).toString('hex');
      let passwordHash = account.passwordHash;
      let privateKeyAES = account.privateKeyAES;
      if (sha256Pwd !== passwordHash) {
        alert('密碼錯誤!');
        return;
      }
      email = account.id;
      password = accountPwd;
      privateKey = GibberishAES.dec(privateKeyAES, passwordHash);
      user.id = email;
      user.privateKey = privateKey;
      user.pwd = password;
      user.loginType = loginType;
    } else {
      return;
    }
    if (!(/^(0x)?[a-f0-9]+$/.test(privateKey))) {
      return;
    }
    if (privateKey.length === 66 || privateKey.length === 64) {//如果長度正確
      this.props.login(user);
    } else {//私鑰長度不正確

    }
  }

  // identicon() {
  //   let base64Img = new Identicon(sha256(this.state.privateKeyInput).toString('hex'),{size: 512}).toString()
  //   return `data:image/svg;base64,${base64Img}`
  // }
  render() {
    let toggleButtonValue = this.state.loginType;
    return (
      <Form onSubmit={this.loginBtn.bind(this)}>
        <h1>The Wallet</h1>
        <FormGroup onChange={this.changeLoginTypeBtn.bind(this)}>
          <Radio name="loginType" inline={true} value="email" defaultChecked={toggleButtonValue === 'email' ? 'checked' : ''} >
            賬密
              </Radio>
          <Radio name="loginType" inline={true} value="private_key" defaultChecked={toggleButtonValue === 'private_key' ? 'checked' : ''} >
            私鑰
              </Radio>
          <Radio name="loginType" inline={true} value="local_storage" defaultChecked={toggleButtonValue === 'local_storage' ? 'checked' : ''} >
            記憶
              </Radio>
        </FormGroup>
        {(() => {
          if (toggleButtonValue === 'email') {
            return (<div>
              <FormGroup>
                <ControlLabel>Email:</ControlLabel>
                <FormControl
                  type="email"
                  value={this.state.email}
                  placeholder="Email"
                  onChange={this.setEmail.bind(this)}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  required
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password:</ControlLabel>
                <FormControl
                  type="password"
                  value={this.state.password}
                  placeholder="Password"
                  onChange={this.setPassword.bind(this)}
                  pattern=".{8,}"
                  required
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>PrivateKey:</ControlLabel>
                <InputGroup>
                  <FormControl
                    type={this.state.passwordType}
                    value={this.state.privateKeyByPwd}
                    placeholder="PrivateKey"
                    size="66"
                    disabled
                    pattern="^(0x)?[a-f0-9]+$"
                    required
                  />
                  <InputGroup.Addon onClick={() => this.setState.call(this, { passwordType: this.state.passwordType === 'password' ? 'text' : 'password' })}>Show</InputGroup.Addon>
                </InputGroup>
                <FormGroup onChange={this.changeSavePwdBtn.bind(this)}>
                  <Checkbox inline={true} value="save_passwd">
                    是否記憶email
                  </Checkbox>
                </FormGroup>
              </FormGroup>
            </div>)
          } else if (toggleButtonValue === 'private_key') {
            return (<div>
              <FormGroup>
                <ControlLabel>PrivateKey:</ControlLabel>
                <InputGroup>
                  <FormControl
                    type={this.state.passwordType}
                    value={this.state.privateKeyInput}
                    placeholder="PrivateKey"
                    onChange={this.setPrivateKey.bind(this)}
                    maxLength="66"
                    pattern="^(0x)?[a-f0-9]+$"
                    required
                  />
                  <InputGroup.Addon onClick={() => this.setState.call(this, { passwordType: this.state.passwordType === 'password' ? 'text' : 'password' })}>Show</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </div>);
          }
          else if (toggleButtonValue === 'local_storage') {
            let accounts = StorageUtil.accounts;
            let { account, accountPwd } = this.state;
            let account_key = account ? account.name : '';
            return (<div>
              <FormGroup controlId="formControlsSelect" >
                <ControlLabel>請選擇賬號:</ControlLabel>
                <FormControl componentClass="select" placeholder="select" onChange={this.onChangeAccount} >
                  <option value="">請選擇</option>
                  {
                    [...accounts].map((elt) => {
                      let key = elt[0];
                      return <option value={key} selected={account_key === key}>{key}</option>;
                    })
                  }
                </FormControl>
                {
                  !account ? '' : (<div>
                    <ControlLabel>密碼:</ControlLabel>
                    <FormControl
                      type="password"
                      value={accountPwd}
                      placeholder="Password"
                      pattern=".{8,}"
                      onChange={this.changeAccountPwd}
                      required
                    />
                  </div>)
                }

              </FormGroup>
            </div>);
          }
        })()}

        <Button type="submit" >Login</Button>

      </Form>
    );
  }

  changeLoginTypeBtn(elt) {
    this.setState({ loginType: elt.target.value });
  }

  changeSavePwdBtn(elt) {
    if (elt.target.checked) {
      this.saveEmailFlag = elt.target.value;
    } else {
      this.saveEmailFlag = '';
    }
  }

  onChangeAccount = (elt) => {

    let value = elt.target.value;
    let accounts = StorageUtil.accounts;
    let account = accounts.get(value);
    this.setState({ account, accountPwd: '' });
  };

  changeAccountPwd = (elt) => {
    let value = elt.target.value;
    this.setState({ accountPwd: value });
  };

}
