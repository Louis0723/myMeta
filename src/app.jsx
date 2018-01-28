import * as React from 'react';
import { LoginComponent } from './page/login';
import { MainComponent } from './page/main';
import { Grid, Row, Col } from 'react-bootstrap';
import UserDomain from "./domain/userDomain";

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: null,
    }
  }
  Login(loginUser) {
	  UserDomain.loginUser = loginUser;
    this.setState({ loginUser });
  }
  Logout() {
    let loginUser = UserDomain.loginUser;
    if(loginUser) {
        loginUser.privateKey = '';
    }
    this.setState({ loginUser});
  }
  render() {
    let loginUser = UserDomain.loginUser;
	  let privateKey = '';
    if(loginUser){
	    privateKey = loginUser.privateKey;
    }
      return (
      <Grid><Row><Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3}>
        {privateKey ? <MainComponent privateKey={privateKey} logout={this.Logout.bind(this)} /> : <LoginComponent login={this.Login.bind(this)} />}
      </Col></Row></Grid>
    );
  }
}