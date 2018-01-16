import * as React from 'react';
import { LoginComponent } from './login';
import { MainComponent } from './main';
import { sha256 } from 'ethereumjs-util';
import { Grid, Row, Col } from 'react-bootstrap';

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: null,
    }
  }
  Login(privateKey) {
    this.setState({ privateKey });
  }
  Logout() {
    this.setState({ privateKey: null });
  }
  render() {
    return (
      <Grid><Row><Col xs={10} xsOffset={1} >
        {
          this.state.privateKey ? <MainComponent privateKey={this.state.privateKey} logout={this.Logout.bind(this)} /> : <LoginComponent login={this.Login.bind(this)} />
        }
      </Col></Row></Grid>
    );
  }
}