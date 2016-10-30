import axios from 'axios';
import { BASE_URL } from 'config';

export function register({ fname, lname, email, password, profile_photo_url, gender }) {
    return {
        type: 'REGISTER_USER',
        payload: axios.post(`${BASE_URL}/api/register`, { fname, lname, email, password, profile_photo_url, gender })
    };
}

export function login({ email, password }) {
    return {
        type: 'LOGIN_USER',
        payload: axios.post(`${BASE_URL}/api/login`, { email, password })
    };
}

export function resetPassword(email) {
    return {
        type: 'RESET_PASSWORD',
        payload: axios.post(`${BASE_URL}/api/resetpassword`, { email })
    };
}

export function validateUser({ code }) {
    const type = code ? 'VALIDATE_USER' : 'VALIDATE_USER_REJECTED';
    const payload = code ? axios.get(`${BASE_URL}/api/validate?c=${code}`) : { response: { data: { message: 'Failed to validate user. Validation code is missing' } }, validateSuccess: false, validating: false };
    return { type, payload };
}

export function validateResetLink({ code }) {
    const type = code ? 'VALIDATE_RESET_LINK' : 'VALIDATE_RESET_LINK_REJECTED';
    const payload = code ? axios.get(`${BASE_URL}/api/validateresetlink?c=${code}`) : { response: { data: { message: 'Validation code is missing.' } }, validateSuccess: false, validating: false };
    return { type, payload };
}

export function newPassword({ password, link }) {
    return {
        type: 'NEW_PASSWORD',
        payload: axios.post(`${BASE_URL}/api/newpassword`, { password, link })
    };
}

export function logout() {
    return {
        type: 'LOGOUT',
        payload: axios.post(`${BASE_URL}/api/logout`)
    };
}

export function validateToken(at, rt) {
    return {
        type: 'VALIDATE_TOKEN',
        payload: axios.get(`${BASE_URL}/api/validate/c`, { 'headers': { 'X-ACCESS-TOKEN': at || 0, 'X-REFRESH-TOKEN': rt || 0 } })
    };
}
