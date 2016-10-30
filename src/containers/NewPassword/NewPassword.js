import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { validateResetLink, newPassword } from 'actions/AuthActions';
import { Form, TextInput } from 'components';
import * as validations from 'libs/validations';

@connect((store) => {
    return {
        resetLink: store.routing.locationBeforeTransitions.query.c,
        changingNewPassword: store.auth.changingNewPassword,
        resetLinkValidated: store.auth.resetLinkValidated,
        resetLinkValidating: store.auth.resetLinkValidating,
        resetLinkValidateSuccesMsg: store.auth.resetLinkValidateSuccesMsg,
        resetLinkValidateErrorMsg: store.auth.resetLinkValidateErrorMsg,
        resetPasswordUser: store.auth.resetPasswordUser
    };
})

export default class NewPassword extends React.Component {

    constructor(props) {
        super(props);
        this.handlePasswordReset = this.handlePasswordReset.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.passwordValidation = this.passwordValidation.bind(this);
        this.state = {
            'password': ''
        };
    }

    componentDidMount() {
        if (this.props.resetLink) {
            this.props.dispatch(validateResetLink({ code: encodeURIComponent(this.props.resetLink) }))
                .then(() => {})
                .catch(() => {});
        } else {
            this.props.dispatch(validateResetLink({ code: '' }));
        }
    }

    handlePasswordReset() {
        this.props.dispatch(newPassword({ password: this.state.password, link: this.props.resetLink }))
            .then(() => {
                browserHistory.push('/login');
            })
            .catch(() => {

            });
    }

    handleInputChange({ name, value }) {
        const state = {};
        state[name] = value;
        this.setState(state);
    }

    passwordValidation(password) {
        if (!validations.passwordValidation(password)) {
            return { success: false, errorMessage: 'Password must contain at least one letter, one number and one special character' };
        }
        return { success: true };
    }

    render() {
        const styles = require('./NewPassword.scss');
        return (
            <div className={styles.NewPassword}>
                <div className={`col-sm-3 vertical-align ${styles.NewPasswordContainer}`}>
                    <h1 className={styles.CompanyName}>A G A P E</h1>
                    <div>
                        { this.props.resetLinkValidating ?
                            <div>Validating...</div> :
                            null
                        }
                    </div>
                    { !this.props.resetLinkValidating && this.props.resetLinkValidated ?
                        <div>
                            <div className={styles.WelcomeSubtitle}>Welcome {this.props.resetPasswordUser.fname + ' ' + this.props.resetPasswordUser.lname}</div>
                            <div className={styles.ValidationSuccess}>{ this.props.resetLinkValidateSuccesMsg } <br/> Please insert your new password.</div>
                            <Form
                                onSubmit={this.handlePasswordReset}>
                                <TextInput
                                    value = {this.state.password}
                                    type = {'password'}
                                    name = {'password'}
                                    displayName = { 'password' }
                                    placeholder = {'Password'}
                                    minLength = { 6 }
                                    maxLength = { 30 }
                                    customValidations = { [this.passwordValidation] }
                                    required
                                    handleInputChange = {this.handleInputChange}/>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-success form-control" disabled={this.props.changingNewPassword}>Submit</button>
                                </div>
                            </Form>
                            <div className={styles.BackToLogin}>
                                <Link to="/login" className={styles.Link}>Back to Login</Link>
                            </div>
                            <div className={styles.Copyright}>
                                <p>© 2016. All RIGHT RESERVED.</p>
                            </div>
                        </div>
                        : <div>
                            { this.props.resetLinkValidateErrorMsg }
                        </div>
                    }
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

NewPassword.propTypes = {
    dispatch: React.PropTypes.func,
    changingNewPassword: React.PropTypes.bool,
    resetLink: React.PropTypes.string,
    resetLinkValidated: React.PropTypes.bool,
    resetLinkValidating: React.PropTypes.bool,
    resetLinkValidateSuccesMsg: React.PropTypes.string,
    resetLinkValidateErrorMsg: React.PropTypes.string,
    resetPasswordUser: React.PropTypes.object
};
