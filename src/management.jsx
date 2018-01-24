
import * as React from 'react';
import { Form,Button }  from 'react-bootstrap';
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
        <Button>Save Account {/Electron/.test(navigator.userAgent)?'':'To This Browser'}</Button>
      </Form>
    );
  }
}
