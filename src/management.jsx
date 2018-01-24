
import * as React from 'react';
import { Form,Button }  from 'react-bootstrap';
import * as GibberishAES from 'gibberish-aes/dist/gibberish-aes-1.0.0.min';

export class ManagementComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  /** 
   * id : sha256(privateKey)
   * name : sha256(privateKey) *default
   * password : sha256(password)
   * privateKey : aes(password,privateKey)
   */

  render() {
    return (
      <Form>
        <Button onClick={this.doTestAES256Btn} >AES測試</Button>
        <Button>Save Account {/Electron/.test(navigator.userAgent)?'':'To This Browser'}</Button>
      </Form>
    );
  }

    doTestAES256Btn() {
        let enc = GibberishAES.enc("This sentence is super secret", "ultra-strong-password");
        alert(enc);
        let decEnc = GibberishAES.dec(enc, "ultra-strong-password");
        alert(decEnc);
    }
}
