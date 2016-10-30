import React from 'react';
import { Form, TextInput } from 'components';
import * as AuthActions from 'actions/AuthActions';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

@connect((store) => {
    return {
        loggingIn: store.auth.loggingIn || false,
        loginSuccess: store.auth.loginSuccess || false,
        loginErrorMsg: store.auth.loginErrorMsg || '',
        validateSuccessMsg: store.auth.validateSuccessMsg || '',
        newPasswordSuccessMsg: store.auth.newPasswordSuccessMsg || ''
    };
})

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleInputChange({ name, value }) {
        const state = {};
        state[name] = value;
        this.setState(state);
    }

    handleLogin() {
        this.props.dispatch(AuthActions.login({...this.state }))
            .then(() => {
                browserHistory.push('/main');
            })
            .catch(() => {});
    }

    render() {
        const styles = require('./Login.scss');
        return (
            <div className={styles.Login}>
                <div className={`col-sm-3 ${styles.LoginContainer}`}>
                    <h1 className={styles.CompanyName}>C O M P A N Y</h1>
                    <div className={styles.Subtitle}>
                        Login to your account
                    </div>
                    { this.props.validateSuccessMsg ? <div className={styles.Success}>{this.props.validateSuccessMsg}</div> : null }
                    { this.props.newPasswordSuccessMsg ? <div className={styles.Success}>{this.props.newPasswordSuccessMsg}</div> : null }
                    <Form
                        onSubmit={this.handleLogin}>
                        <TextInput
                            value = {this.state.email}
                            name = {'email'}
                            displayName = { 'email' }
                            placeholder = {'Email Address'}
                            email
                            required
                            handleInputChange = {this.handleInputChange}/>
                        <TextInput
                            value = {this.state.password}
                            type = {'password'}
                            name = {'password'}
                            displayName = { 'password' }
                            placeholder = {'Password'}
                            required
                            handleInputChange = {this.handleInputChange}/>
                        <div className={`col-sm-12 ${styles.ResetPassword}`}>
                            <Link to="/resetpassword" className={`pull-right ${styles.Link}`}>
                                Forgot Password
                            </Link>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-success form-control" disabled={this.props.loggingIn}>Login</button>
                        </div>
                    </Form>
                    { this.props.loginErrorMsg ? <div className={styles.Error}>{this.props.loginErrorMsg}</div> : null }
                    <div className={`col-sm-12 ${styles.RegisterBtn}`}>
                        <Link to="/register" className={styles.Link}>Don't have an account yet? Register</Link>
                    </div>
                    <div className={styles.Copyright}>
                        <p>© 2016. All RIGHT RESERVED.</p>
                    </div>
                </div>
                <div>
                    <video autoPlay loop className={styles.Background} poster="./Meeting-Room.jpg">
                        <source src="./Meeting-Room.mp4" type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
                        <source src="./Meeting-Room.webm" type="video/webm" />Your browser does not support the video tag. I suggest you upgrade your browser.
                    </video>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    dispatch: React.PropTypes.func,
    validateSuccessMsg: React.PropTypes.string,
    loggingIn: React.PropTypes.bool,
    loginError: React.PropTypes.string,
    loginErrorMsg: React.PropTypes.string,
    newPasswordSuccessMsg: React.PropTypes.string
};
