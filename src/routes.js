import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as AuthActions from './actions/AuthActions';
import { App, About, Login, Register, ResetPassword, NewPassword, Validate, Main, NotFound } from 'containers';

export default (store) => {
    const requireLogin = (nextState, replace, cb) => {
        function checkAuth() {
            const user = store.getState().auth.user;
            const verified = store.getState().auth.verified;
            if (!user || !verified || !user.verified) {
                replace('/login');
            }
            cb();
        }
        if (!store.getState().auth.verified || store.getState().auth.validateSuccess) {
            store.dispatch(AuthActions.validateToken())
                .then(() => {
                    checkAuth();
                })
                .catch(() => {
                    checkAuth();
                });
        } else {
            checkAuth();
        }
    };

    const notRequireLogin = (nextState, replace, cb) => {
        function checkAuth() {
            const user = store.getState().auth.user;
            const verified = store.getState().auth.verified;
            if (user && verified && user.verified) {
                replace('/main');
            }
            cb();
        }
        if (!store.getState().auth.verified || store.getState().auth.validateSuccess) {
            store.dispatch(AuthActions.validateToken())
                .then(() => {
                    checkAuth();
                })
                .catch(() => {
                    checkAuth();
                });
        } else {
            checkAuth();
        }
    };

    return (
        <Route path="/" component={App}>
            { /* Home (main) route */ }
            <IndexRoute component={Login}/>

            <Route onEnter={requireLogin}>
                <Route path="main" component={Main}/>
            </Route>

            { /* Routes */ }
            <Route path="about" component={About}/>

            <Route onEnter={notRequireLogin}>
                <Route path="login" component={Login}/>
                <Route path="register" component={Register}/>
                <Route path="validate" component={Validate}/>
                <Route path="resetpassword" component={ResetPassword}/>
                <Route path="newpassword" component={NewPassword}/>
            </Route>

            { /* Catch all route */ }
            <Route path="*" component={NotFound} status={404} />
        </Route>
    );
};
