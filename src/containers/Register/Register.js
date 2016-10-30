import React from 'react';
import { Form, TextInput, FacebookRegisterBtn, GoogleRegisterBtn } from 'components';
import { connect } from 'react-redux';
import * as AuthActions from 'actions/AuthActions';
import { Link } from 'react-router';
import * as validations from 'libs/validations';
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from 'config';

@connect((store) => {
    return {
        registering: store.auth.registering || false,
        registerSuccess: store.auth.registerSuccess || undefined,
        registerSuccessMsg: store.auth.registerSuccessMsg || '',
        registerErrorMsg: store.auth.registerErrorMsg || '',
    };
})

export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fname: '',
            lname: '',
            email: '',
            reemail: '',
            password: '',
            profile_photo_url: '',
            gender: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.matchEmailValidation = this.matchEmailValidation.bind(this);
        this.passwordValidation = this.passwordValidation.bind(this);
        this.facebookResponse = this.facebookResponse.bind(this);
        this.googleResponse = this.googleResponse.bind(this);
    }

    handleInputChange({ name, value }) {
        const state = {};
        state[name] = value;
        this.setState(state);
    }

    matchEmailValidation(name, value) {
        if (name === 'email') {
            return {
                success: value === this.state.reemail,
                errorMessage: 'Email must match with re-email'
            };
        }
    }

    passwordValidation(password) {
        if (!validations.passwordValidation(password)) {
            return { success: false, errorMessage: 'Password must contain at least one letter, one number and one special character' };
        }
        return { success: true };
    }

    handleRegister() {
        this.props.dispatch(AuthActions.register({...this.state }));
    }

    facebookResponse(resp) {
        const { first_name, last_name, email, picture, gender, id } = resp;
        this.setState({
            fname: first_name,
            lname: last_name,
            email: email,
            password: '',
            profile_photo_url: picture.data.url ? `https://graph.facebook.com/${id}/picture?width=9999` : '',
            gender: gender,
            provider: 'Facebook'
        });
    }

    googleResponse(resp) {
        const { Na, Za, hg, Ph } = resp.wc;
        this.setState({
            fname: Na,
            lname: Za,
            email: hg,
            profile_photo_url: Ph || '',
            password: '',
            provider: 'Google'
        });
    }

    render() {
        const styles = require('./Register.scss');
        return (
            <div className={styles.Register}>
                <div className={`col-sm-3 ${styles.RegisterContainer}`}>
                    <h1 className={styles.CompanyName}>C O M P A N Y</h1>
                    { !this.state.provider ? <div>
                        { this.props.registerSuccess ?
                            <div className={styles.Success}>{this.props.registerSuccessMsg}</div> :
                            <div>
                                <div className={styles.Subtitle}>
                                    Register your new account
                                </div>
                                <Form
                                    onSubmit={this.handleRegister}
                                    customValidations={[this.matchEmailValidation]}>
                                        <TextInput
                                            value = {this.state.fname}
                                            name = {'fname'}
                                            displayName = { 'first name' }
                                            placeholder = {'First Name'}
                                            width = { 6 }
                                            required
                                            handleInputChange = {this.handleInputChange}/>
                                        <TextInput
                                            value = {this.state.lname}
                                            name = {'lname'}
                                            displayName = { 'last name' }
                                            placeholder = {'Last Name'}
                                            width = { 6 }
                                            required
                                            handleInputChange = {this.handleInputChange}/>
                                        <TextInput
                                            value = {this.state.email}
                                            name = {'email'}
                                            displayName = { 'email address' }
                                            placeholder = {'Email Address'}
                                            required
                                            width = { 12 }
                                            email
                                            handleInputChange = {this.handleInputChange}/>
                                        <TextInput
                                            value = {this.state.reemail}
                                            name = {'reemail'}
                                            displayName = { 're-email address' }
                                            placeholder = {'Re-Email Address'}
                                            required
                                            width = { 12 }
                                            email
                                            handleInputChange = {this.handleInputChange}/>
                                        <TextInput
                                            value = {this.state.password}
                                            type = {'password'}
                                            name = {'password'}
                                            displayName = { 'password' }
                                            placeholder = {'Password'}
                                            minLength = { 6 }
                                            maxLength = { 30 }
                                            width = { 12 }
                                            customValidations = { [this.passwordValidation] }
                                            required
                                            handleInputChange = {this.handleInputChange}/>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <button type="submit" className="btn btn-success form-control" disabled={ this.props.registering }>Register</button>
                                            </div>
                                        </div>
                                </Form>
                                {
                                    this.props.registerErrorMsg ?
                                    <div className={styles.Error}>{this.props.registerErrorMsg}</div>
                                    : null
                                }
                                <div className={`col-sm-12 ${styles.OrContainer}`}>
                                    <hr className={`col-sm-4 pull-left ${styles.OrHr}`} />
                                    <span className={`col-sm-1 ${styles.Or}`}>OR</span>
                                    <hr className={`col-sm-4 pull-right ${styles.OrHr}`} />
                                </div>
                                <div className={`col-sm-12`}>
                                    <FacebookRegisterBtn
                                        appId={FACEBOOK_APP_ID}
                                        callback={this.facebookResponse} />
                                </div>
                                <div className="col-sm-12">
                                    <GoogleRegisterBtn
                                    clientId={GOOGLE_CLIENT_ID}
                                    callback={this.googleResponse} />
                                </div>
                            </div>
                        }
                    </div>
                    :
                    <div>
                        { this.props.registerSuccessMsg ? <div className={styles.Success}>{this.props.registerSuccessMsg}</div> : <div>
                                <Form onSubmit={this.handleRegister} >
                                    <div className={styles.ProviderSubtitle}>Welcome {this.state.fname} {this.state.lname}</div>
                                    <div className={styles.PhotoContainer}>
                                        { this.state.profile_photo_url ? <img src={this.state.profile_photo_url} className={`img-circle ${styles.ProviderPhoto}`} /> : null }
                                    </div>
                                    <div className={styles.Subtitle}>
                                        Please select a password for your Agape account
                                    </div>
                                    <TextInput
                                        value = {this.state.email}
                                        name = {'email'}
                                        displayName = { 'email address' }
                                        placeholder = {'Email Address'}
                                        required
                                        email
                                        handleInputChange = {this.handleInputChange}/>
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
                                        <button type="submit" className="btn btn-success    form-control" disabled={ this.props.registering }>Register</button>
                                    </div>
                                </Form>
                                { this.props.registerErrorMsg ? <div className={styles.Error}>{this.props.registerErrorMsg}</div> : null }
                            </div>
                        }
                    </div> }
                    <div className={`col-sm-12 ${styles.LoginBtn}`}>
                        <Link to="/login" className={styles.Link}>Already have an account? Login</Link>
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

Register.propTypes = {
    dispatch: React.PropTypes.func,
    registering: React.PropTypes.bool,
    registerError: React.PropTypes.string,
    registerSuccess: React.PropTypes.bool,
    registerSuccessMsg: React.PropTypes.string,
    registerErrorMsg: React.PropTypes.string,
};
