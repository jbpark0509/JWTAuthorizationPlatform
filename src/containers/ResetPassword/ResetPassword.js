import React from 'react';
import { connect } from 'react-redux';
import { Form, TextInput } from 'components';
import { Link } from 'react-router';
import { resetPassword } from 'actions/AuthActions';

@connect((store) => {
    return {
        resettingPassword: store.auth.resettingPassword || false,
        resetEmailSent: store.auth.resetEmailSent || false,
        resetEmailSuccessMsg: store.auth.resetEmailSuccessMsg || '',
        resetEmailErrorMsg: store.auth.resetEmailErrorMsg || '',
    };
})

export default class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.handleResetPassword = this.handleResetPassword.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            email: ''
        };
    }

    handleResetPassword() {
        this.props.dispatch(resetPassword(this.state.email))
        .then(() => {

        })
        .catch(() => {

        });
    }

    handleInputChange({ name, value }) {
        const state = {};
        state[name] = value;
        this.setState(state);
    }

    render() {
        const styles = require('./ResetPassword.scss');
        return (
            <div className={styles.ResetPassword}>
                <div className={`col-sm-3 ${styles.ResetPasswordContainer}`}>
                    <h1 className={styles.CompanyName}>A G A P E</h1>
                    <div className={styles.Subtitle}>
                        Insert your emaill address
                    </div>
                    <Form onSubmit={this.handleResetPassword}>
                        <TextInput
                            value = {this.state.resetEmail}
                            name = {'email'}
                            displayName = { 'email' }
                            placeholder = {'Email Address'}
                            email
                            required
                            handleInputChange = {this.handleInputChange}/>
                        <div className="form-group">
                            <button type="submit" className="btn btn-success form-control" disabled={this.props.resettingPassword}>Send Email</button>
                        </div>
                    </Form>
                    { this.props.resetEmailSuccessMsg ? <div className={styles.Success}>{this.props.resetEmailSuccessMsg}</div> : null }
                    { this.props.resetEmailErrorMsg ? <div className={styles.Error}>{this.props.resetEmailErrorMsg}</div> : null }
                    <div className={`${styles.BackToLogin}`}>
                        <Link to="/login" className={`${styles.Link}`}>Back to Login</Link>
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

ResetPassword.propTypes = {
    dispatch: React.PropTypes.func,
    resettingPassword: React.PropTypes.bool,
    resetEmailSent: React.PropTypes.bool,
    resetEmailSuccessMsg: React.PropTypes.string,
    resetEmailErrorMsg: React.PropTypes.string
};
