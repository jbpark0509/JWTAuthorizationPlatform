const stateInit = {
    user: false,
    verified: false,
};

export default function reducer(state = stateInit, action) {
    switch (action.type) {
        case 'REGISTER_USER_PENDING':
            {
                return {...state, registering: true };
            }
        case 'REGISTER_USER_FULFILLED':
            {
                return {...state, registering: false, registerSuccess: true, registerSuccessMsg: action.payload.data.message };
            }
        case 'REGISTER_USER_REJECTED':
            {
                return {...state, registering: false, registerSuccess: false, registerErrorMsg: action.payload.response.data.message };
            }
        case 'VALIDATE_USER_PENDING':
            {
                return {...state, validating: true };
            }
        case 'VALIDATE_USER_FULFILLED':
            {
                return {...state, validating: false, validateSuccess: true, validateSuccessMsg: action.payload.data.message };
            }
        case 'VALIDATE_USER_REJECTED':
            {
                return {...state, validating: false, validateSuccess: false, validateErrorMsg: action.payload.response.data.message };
            }
        case 'LOGIN_USER_PENDING':
            {
                return {...state, loggingIn: true };
            }
        case 'LOGIN_USER_FULFILLED':
            {
                return {...state, loggingIn: false, loginSuccess: true, user: action.payload.data.user, verified: true };
            }
        case 'LOGIN_USER_REJECTED':
            {
                return {...state, loggingIn: false, loginSuccess: false, loginErrorMsg: action.payload.response.data.message };
            }
        case 'VALIDATE_TOKEN_PENDING':
            {
                return {...state, validating: true };
            }
        case 'VALIDATE_TOKEN_FULFILLED':
            {
                return {...state, validating: false, user: action.payload.data.user, verified: true };
            }
        case 'VALIDATE_TOKEN_REJECTED':
            {
                return {...state, validating: false, verified: true };
            }
        case 'RESET_PASSWORD_PENDING':
            {
                return {...state, resettingPassword: true, resetEmailSent: false, resetEmailSuccessMsg: '', resetEmailErrorMsg: '' };
            }
        case 'RESET_PASSWORD_FULFILLED':
            {
                return {...state, resettingPassword: false, resetEmailSent: true, resetEmailSuccessMsg: action.payload.data.message, resetEmailErrorMsg: '' };
            }
        case 'RESET_PASSWORD_REJECTED':
            {
                return {...state, resettingPassword: false, resetEmailSent: false, resetEmailSuccessMsg: '', resetEmailErrorMsg: action.payload.response.data.message };
            }
        case 'VALIDATE_RESET_LINK_PENDING':
            {
                return {...state, resetLinkValidating: true, resetLinkValidated: false, resetLinkValidateSuccesMsg: '', resetLinkValidateErrorMsg: '', resetPasswordUser: false };
            }
        case 'VALIDATE_RESET_LINK_FULFILLED':
            {
                return {...state,
                    resetLinkValidating: false,
                    resetLinkValidated: true,
                    resetLinkValidateSuccesMsg: action.payload.data.message,
                    resetLinkValidateErrorMsg: '',
                    resetPasswordUser: action.payload.data.user
                };
            }
        case 'VALIDATE_RESET_LINK_REJECTED':
            {
                return {...state, resetLinkValidating: false, resetLinkValidated: false, resetLinkValidateSuccesMsg: '', resetLinkValidateErrorMsg: action.payload.response.data.message };
            }
        case 'NEW_PASSWORD_PENDING':
            {
                return {...state, changingNewPassword: true, newPasswordChanged: false, newPasswordSuccessMsg: '', newPasswordErrorMsg: '' };
            }
        case 'NEW_PASSWORD_FULFILLED':
            {
                return {...state, changingNewPassword: false, newPasswordChanged: true, newPasswordSuccessMsg: action.payload.data.message, newPasswordErrorMsg: '' };
            }
        case 'NEW_PASSWORD_REJECTED':
            {
                return {...state, changingNewPassword: false, newPasswordChanged: false, newPasswordSuccessMsg: '', newPasswordErrorMsg: action.payload.response.data.message };
            }
        case 'LOGOUT_PENDING':
            {
                return {...state, loggingOut: true, loggedOut: false, logoutErrorMsg: '', validateSuccessMsg: '', newPasswordSuccessMsg: '' };
            }
        case 'LOGOUT_FULFILLED':
            {
                return {...state, user: false, loggingOut: false, loggedOut: true, logoutErrorMsg: '' };
            }
        case 'LOGOUT_REJECTED':
            {
                return {...state, loggingOut: false, loggedOut: false, logoutErrorMsg: action.payload.response.data.message };
            }
        default:
            {
                return state;
            }
    }
}
