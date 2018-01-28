import * as React from 'react';
import { Button, Alert, ButtonToolbar } from 'react-bootstrap';
require('../global.scss')

export class AlertComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            alertVisible: this.props.visible,
        }
    }
    handleAlertDismiss() {
        this.setState({ alertVisible: false });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            alertVisible: nextProps.visible
        })
    }
    sure() {
        this.props.sure()
        this.setState({
            alertVisible: false
        })
    }
    render() {
        if (this.state.alertVisible) {
            return (
                <div className="mask">
                    <Alert
                        bsStyle={this.props.type}
                        onDismiss={this.handleAlertDismiss.bind(this)}
                        className="alert-fixed"
                    >
                        <h4>{this.props.title}</h4>
                        <p>
                            {this.props.body}
                        </p>

                        <ButtonToolbar>
                            {
                                (() => {
                                    if (this.props.sure) {
                                        return (<Button bsStyle={this.props.type} onClick={this.sure.bind(this)}>OK</Button>)
                                    }
                                    return (<i></i>)
                                })()
                            }
                            ,<Button onClick={this.props.close ? this.props.close : this.handleAlertDismiss.bind(this)}>Cloas</Button>
                        </ButtonToolbar>

                    </Alert>
                </div>
            )
        }
        return (<i className="alert-fixed"></i>)
    }
}