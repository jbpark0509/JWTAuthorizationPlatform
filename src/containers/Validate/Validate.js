import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as AuthActions from 'actions/AuthActions';

@connect((store) => {
    return {
        code: store.routing.locationBeforeTransitions.query.c,
        validating: store.auth.validating,
        validateSuccess: store.auth.validateSuccess,
        validateErrorMsg: store.auth.validateErrorMsg
    };
})

export default class Validate extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.code) {
            this.props.dispatch(AuthActions.validateUser({ code: encodeURIComponent(this.props.code) }))
            .then(() => {
                browserHistory.push('/main');
            })
            .catch(() => {
            });
        } else {
            this.props.dispatch(AuthActions.validateUser({ code: '' }));
        }
    }

    render() {
        return (
            <div>
                { this.props.validating ? <div>Validating...</div> : null }
                { this.props.validateErrorMsg ? <div>{this.props.validateErrorMsg}</div> : null }
                { this.validationError ? <div>{this.validationError}</div> : null }
            </div>
        );
    }
}

Validate.propTypes = {
    code: React.PropTypes.string,
    validating: React.PropTypes.bool,
    validateSuccess: React.PropTypes.bool,
    validateErrorMsg: React.PropTypes.string,
    dispatch: React.PropTypes.func,
};
