import React, { PropTypes } from 'react';

export default class FacebookRegisterBtn extends React.Component {

    static propTypes = {
        callback: PropTypes.func.isRequired,
        appId: PropTypes.string.isRequired,
        xfbml: PropTypes.bool,
        cookie: PropTypes.bool,
        scope: PropTypes.string,
        textButton: PropTypes.string,
        typeButton: PropTypes.string,
        autoLoad: PropTypes.bool,
        fields: PropTypes.string,
        version: PropTypes.string,
        icon: PropTypes.string,
        language: PropTypes.string,
    };

    static defaultProps = {
        textButton: 'Login with Facebook',
        typeButton: 'button',
        scope: 'public_profile,email',
        xfbml: false,
        cookie: false,
        fields: 'first_name,last_name,email,picture,gender,birthday',
        version: '2.3',
        language: 'en_US',
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { appId, xfbml, cookie, version, autoLoad, language } = this.props;
        const fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';

        document.body.appendChild(fbRoot);

        window.fbAsyncInit = () => {
            window.FB.init({
                version: `v${version}`,
                appId,
                xfbml,
                cookie,
            });

            if (autoLoad || window.location.search.includes('facebookdirect')) {
                window.FB.getLoginStatus(this.checkLoginState);
            }
        };
        // Load the SDK asynchronously
        ((da, sa, id) => {
            const element = da.getElementsByTagName(sa)[0];
            const fjs = element;
            let js = element;
            if (da.getElementById(id)) {
                return;
            }
            js = da.createElement(sa);
            js.id = id;
            js.src = `//connect.facebook.net/${language}/all.js`;
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }

    responseApi = (authResponse) => {
        window.FB.api('/me', { fields: this.props.fields }, (me) => {
            Object.assign(me, authResponse);
            this.props.callback(me);
        });
    };

    checkLoginState = (response) => {
        if (response.authResponse) {
            this.responseApi(response.authResponse);
        } else {
            if (this.props.callback) {
                this.props.callback({ status: response.status });
            }
        }
    };

    click = () => {
        const { scope, appId } = this.props;
        if (navigator.userAgent.match('CriOS')) {
            window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${window.location.href}&state=facebookdirect&${scope}`;
        } else {
            window.FB.login(this.checkLoginState, { scope });
        }
    };

    render() {
        const styles = require('./FacebookRegisterBtn.scss');
        return (
            <div className="form-group">
        		<button
      		    	className="btn btn-primary form-control"
      		    	onClick={this.click} >
      		    		<i className={`fa fa-facebook pull-left ${styles.FacebookLogo}`} aria-hidden="true"></i>Register with Facebook
      		  	</button>
      		</div>
        );
    }
}
