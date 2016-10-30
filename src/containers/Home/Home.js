import React from 'react';
import { HomeButtons } from 'components';
// import { connect } from 'react-redux';

// @connect((store) => {
//     return {

//     };
// })

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickRegister = this.handleClickRegister.bind(this);
    }

    handleClickLogin(event) {
        event.preventDefault();
        this.context.router.push({
            pathname: '/login'
        });
    }

    handleClickRegister(event) {
        event.preventDefault();
        this.context.router.push({
            pathname: '/register'
        });
    }

    render() {
        return (
            <div>
            	<HomeButtons
            		handleClickLogin={this.handleClickLogin}
            		handleClickRegister={this.handleClickRegister} />
            </div>
        );
    }
}

Home.contextTypes = {
    router: React.PropTypes.object.isRequired
};
