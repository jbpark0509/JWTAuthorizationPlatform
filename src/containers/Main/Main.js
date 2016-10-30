import React from 'react';
import { connect } from 'react-redux';
import { logout } from 'actions/AuthActions';
import { browserHistory } from 'react-router';

@connect((store) => {
    return {
        loggingOut: store.auth.loggingOut,
        loggedOut: store.auth.loggedOut,
        logoutErrorMsg: store.auth.logoutErrorMsg
    };
})

export default class Main extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.props.dispatch(logout())
            .then(() => {
                browserHistory.push('/login');
            })
            .catch(() => {
            });
    }

    render() {
        const styles = require('./Main.scss');
        return (
            <div className={ styles.test }>
                <h3>This is main!</h3>
                <button className="btn btn-success" onClick={this.handleLogout}>Logout</button>
                { !this.props.loggingOut && this.props.logoutErrorMsg ? <div className="animated bounceInDown">{this.props.logoutErrorMsg}</div> : null }
            </div>
        );
    }
}

Main.propTypes = {
    dispatch: React.PropTypes.func,
    loggingOut: React.PropTypes.bool,
    loggedOut: React.PropTypes.bool,
    logoutErrorMsg: React.PropTypes.string
};
