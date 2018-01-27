
import * as React from 'react';
import { makePrivateKey } from './tx';
import {
    Form, FormControl, ControlLabel, Button, FormGroup, InputGroup, Radio,
    ToggleButtonGroup, ToggleButton, Checkbox
} from 'react-bootstrap';
import { AlertComponent } from './alert'


// import * as Identicon from 'identicon.js'
// import {
//   sha256
// } from 'ethereumjs-util';

export class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
      let lastLoginID = localStorage.getItem('userLoginID');
      this.state = {
          email: lastLoginID,
          password: '',
          privateKeyByPwd: '',
          privateKeyInput: '',
          passwordType: 'password',
          loginType: 'email',
          // address: ''
      };
      this.savePwdFlag = null;
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
      let email = this.state.email;
      let password = this.state.password;
      let loginType = this.state.loginType;
      let privateKey = null;
      if (loginType === 'email') {
          /*檢查賬號密碼格式*/
          if (email !== '' && password !== '') {
              if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email))) {
                  event.preventDefault();
                  return;
              }
              if (!(/.{8,}/.test(password))) {
                  event.preventDefault();
                  return;
              }
          } else if (Number(email === '') ^ Number(password === '')) {
              event.preventDefault();
              return;
          }
          /*檢查賬號密碼格式*/
          privateKey = this.state.privateKeyByPwd;
      } else {
          /*檢查金鑰登入方式*/
          privateKey = this.state.privateKeyInput;
          /*檢查金鑰登入方式*/
      }
      if (!(/^(0x)?[a-f0-9]+$/.test(privateKey))) {
          event.preventDefault();
          return;
      }
      if (privateKey.length === 66 || privateKey.length === 64) {//如果長度正確
          /*記錄私鑰*/
          let keys = localStorage.getItem('privateKeys');
          keys = !keys ? [] : JSON.parse(keys);
          if (keys.indexOf(privateKey) === -1) {
              keys.push(privateKey);
          }
          keys = JSON.stringify(keys);
          localStorage.setItem('privateKeys', keys);
          /*記錄私鑰*/
          let savePwdFlag = this.savePwdFlag;
          if (savePwdFlag) {
              localStorage.setItem('userLoginID', email);
          }
          this.props.login(privateKey);
      } else {//私鑰長度不正確

      }
      event.preventDefault();
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
        {/*<ToggleButtonGroup type="radio" name="options" defaultValue={toggleButtonValue} onChange={this.changeLoginTypeBtn.bind(this)} >*/}
          {/*/!*vertical*!/*/}
          {/*<ToggleButton value="email">賬密</ToggleButton>*/}
          {/*<ToggleButton value="private_key">私鑰</ToggleButton>*/}
        {/*</ToggleButtonGroup>*/}
        {/*onChange={this.changeLoginTypeBtn.bind(this)}*/}
          <FormGroup onChange={this.changeLoginTypeBtn.bind(this)}>
              <Radio name="loginType" inline={true} value="email" title="登入模式:" checked={toggleButtonValue==='email'?'checked':''} >
                  賬密
              </Radio>{' '}
              <Radio name="loginType" inline={true} value="private_key" title="登入模式:" checked={toggleButtonValue==='private_key'?'checked':''} >
                  私鑰
              </Radio>{' '}
          </FormGroup>
          {(() => {
            if(toggleButtonValue === 'email'){
              return (<div>
                <FormGroup>
                  <ControlLabel>Email:</ControlLabel>
                  <FormControl
                      type="email"
                      value={this.state.email}
                      placeholder="Email"
                      onChange={this.setEmail.bind(this)}
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
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
                  />
                </FormGroup>
                  <FormGroup>
                  <ControlLabel>PrivateKey:</ControlLabel>
                  <InputGroup>
                      <FormControl
                          type="text"
                          value={this.state.privateKeyByPwd}
                          placeholder="PrivateKey"
                          size="66"
                          disabled
                          pattern="^(0x)?[a-f0-9]+$"
                      />
                  </InputGroup>
                      <FormGroup onChange={this.changeSavePwdBtn.bind(this)}>
                          <Checkbox inline={true} value="save_passwd">
                              是否記憶email
                          </Checkbox>
                      </FormGroup>
              </FormGroup>
              </div>)
            }else if(toggleButtonValue === 'private_key'){
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
                      />
                      <InputGroup.Addon onClick={() => this.setState.call(this, { passwordType: this.state.passwordType === 'password' ? 'text' : 'password' })}>Show</InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                </div>);
            }
          })()}

        <Button type="submit" >Login</Button>

      </Form>
    );
  }

    changeLoginTypeBtn(elt) {
        this.setState({loginType: elt.target.value});
    }

    changeSavePwdBtn(elt) {
      if(elt.target.checked){
          this.savePwdFlag = elt.target.value;
      }else {
          this.savePwdFlag = '';
      }
    }
}
