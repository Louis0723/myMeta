
import * as React from 'react';
import { makePrivateKey } from './tx';
import {
    Form, FormControl, ControlLabel, Button, FormGroup, InputGroup, Radio,
    ToggleButtonGroup, ToggleButton
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
          privateKeyInput: '',
          passwordType: 'password',
          loginType: 'email',
          // address: ''
      };
      this.savePwdFlag = null;
  }

  makePrivateKey() {
    let priv = makePrivateKey(this.state.email, this.state.password);
    this.setState({ privateKeyInput: priv });
    // this.setState({ address: address });
  }

  setEmail(e) {
    this.setState({ email: e.target.value }, this.makePrivateKey);
  }

  setPassword(e) {
    this.setState({ password: e.target.value }, this.makePrivateKey);
  }

  setPrivateKey(e) {
    this.state.email && this.setState({ email: '' });
    this.state.password && this.setState({ password: '' });
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

  setNewPrivateKey(event) {
      let email = this.state.email;
      let password = this.state.password;
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
    } else if (!(/^(0x)?[a-f0-9]+$/.test(this.state.privateKeyInput))) {
      event.preventDefault();
      return;
    }
    if (this.state.privateKeyInput.length === 66 || this.state.privateKeyInput.length === 64) {//如果長度正確
        /*記錄私鑰*/
        let privateKey = this.state.privateKeyInput;
        let keys = localStorage.getItem('privateKeys');
        keys = !keys ? [] : JSON.parse(keys);
        if (keys.indexOf(privateKey) === -1) {
            keys.push(privateKey);
        }
        keys = JSON.stringify(keys);
        localStorage.setItem('privateKeys', keys);
        /*記錄私鑰*/
        let savePwdFlag = this.savePwdFlag;
        if(savePwdFlag) {
            localStorage.setItem('userLoginID',email);
        }
        this.props.login(this.state.privateKeyInput);
    }else{//私鑰長度不正確

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
      <Form onSubmit={this.setNewPrivateKey.bind(this)}>
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
                <ToggleButtonGroup type="checkbox" onChange={this.changeSavePwdBtn.bind(this)} defaultValue={['']}>
                  <ToggleButton value={'save_passwd'} bsSize="small" >是否記憶密碼</ToggleButton>
                </ToggleButtonGroup>
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

    changeSavePwdBtn(values) {
      if(values && values.length >=2) {
          this.savePwdFlag = values[1];
      }else{
          this.savePwdFlag = '';
      }
    }
}
