import React, { PropTypes } from 'react';

export default class GoogleRegisterBtn extends React.Component {

    static propTypes = {
        callback: PropTypes.func.isRequired,
        clientId: PropTypes.string.isRequired,
        buttonText: PropTypes.string,
        offline: PropTypes.bool,
        scope: PropTypes.string,
        redirectUri: PropTypes.string,
        cookiePolicy: PropTypes.string,
        loginHint: PropTypes.string,
        children: React.PropTypes.node,
    };

    static defaultProps = {
        scope: 'profile email',
        redirectUri: 'postmessage',
        cookiePolicy: 'single_host_origin',
    };

    constructor(props) {
        super(props);
        this.onBtnClick = this.onBtnClick.bind(this);
    }

    componentDidMount() {
        const { clientId, scope, cookiePolicy, loginHint } = this.props;
        ((da, sa, id, cb) => {
            const element = da.getElementsByTagName(sa)[0];
            const fjs = element;
            let js = element;
            js = da.createElement(sa);
            js.id = id;
            js.src = '//apis.google.com/js/platform.js';
            fjs.parentNode.insertBefore(js, fjs);
            js.onload = cb;
        })(document, 'script', 'google-login', () => {
            const params = {
                client_id: clientId,
                cookiepolicy: cookiePolicy,
                login_hint: loginHint,
                scope,
            };
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init(params);
            });
        });
    }

    onBtnClick() {
        const auth2 = window.gapi.auth2.getAuthInstance();
        const { offline, redirectUri, callback } = this.props;
        if (offline) {
            const options = {
                'redirect_uri': redirectUri,
            };
            auth2.grantOfflineAccess(options)
                .then((data) => {
                    callback(data);
                });
        } else {
            auth2.signIn()
                .then((response) => {
                    callback(response);
                });
        }
    }

    render() {
        const styles = require('./GoogleRegisterBtn.scss');
        return (
            <div className="form-group">
            	<button className={`btn btn-primary form-control ${styles.GooglePlusBtn}`} onClick={ this.onBtnClick }><i className={`fa fa-google pull-left ${styles.GoogleLogo}`} aria-hidden="true"></i>Register with Google</button>
            </div>
        );
    }
}
