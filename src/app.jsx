import * as React from 'react';
import { LoginComponent } from './page/login';
import { MainComponent } from './page/main';
import { Grid, Row, Col } from 'react-bootstrap';
import UserDomain from "./domain/userDomain";
import {LoginState, TopState ,AppState} from "./vo/state/top_state";
import {observer} from "mobx-react/index";

@observer
export class AppComponent extends React.Component {
	topState = new TopState();
  constructor(props) {
    super(props);
	  let loginState = new LoginState();
	  this.topState.loginState = loginState;
	  this.topState.appState = new AppState();
	  this.loginState = loginState;
  }
  Login(privateKey) {
	  this.loginState.privateKey = privateKey;
    // UserDomain.loginUser = loginUser;
    // this.setState({ loginUser });
  }
  Logout() {
	  this.loginState.privateKey = '';
  }
  render() {
	  let privateKey = this.loginState.privateKey;//is Login Type
      return (
      <Grid><Row><Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3}>
        {privateKey ? <MainComponent topState={this.topState} privateKey={privateKey} logout={this.Logout.bind(this)} /> :
		        <LoginComponent loginState={this.topState.loginState} login={this.Login.bind(this)} />}
      </Col></Row></Grid>
    );
  }
}