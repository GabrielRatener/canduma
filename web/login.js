
import {unique} from "./utils"
import store from "./store"
import * as services from "./services"
import router from "./router"

const createSession = (user = null) => {
    return {
        user

        // TODO: maybe add more stuff here?
    }
}

const loginQueue = [];

const session = {
    ...createSession() // create null session
}

export const states = {
    INDETERMINATE: unique(),
    LOGGED_OUT: unique(),
    LOGGED_IN: unique()
}

export const waitForLogin = () => {
    if (store.state.loggedInStatus === states.INDETERMINATE) {
        return new Promise((win, fail) => {
            loginQueue.push({win, fail});
        });
    } else {
        return new Promise((win, fail) => {
            if (store.state.loggedInStatus === states.LOGGED_IN) {
                win();
            } else {
                fail();
            }
        });
    }
}

export const unauthenticate = () => {

    localStorage.removeItem('user');

    store.dispatch('endSession');

    Object.assign(session, createSession()); // remove session
}

export const authenticate = (user, fromSession = false) => {

    if (!fromSession) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    store.dispatch('startSession', {user});

    Object.assign(session, createSession(user));
}

export const verifySession = () => {
    return services.get('auth/verify-session')
        .then(({success}) => success)
        .catch(() => false)
}

export const logIn = (params) => {
    return services.post('auth/login', params)
        .then(({err, user}) => {
            if (err) {
                return {err, success: false};
            } else {
                authenticate(user);

                return {err: null, success: true};
            }
        });
}

export const logOut = () => {

    services.post('auth/logout')
        .then(({success}) => {
            if (success) {
                unauthenticate();
            }
        });
}

export const signUp = (params) => {
    return services.post('auth/signup', params)
        .then(({err, user}) => {

            if (err) {
                return {err, success: false};
            } else {
                authenticate(user);

                return {err: null, success: true};
            }
        });
}

export const setLoggedInStatus = (status) => {
    if (status === states.INDETERMINATE) {

        throw new Error('Cannot set status to indeterminate!');
    } else {
        const dequeued = loginQueue.splice(0);

        store.dispatch('setLoggedInStatus', status);

        dequeued.forEach(({win, fail}) => {
            if (status === states.LOGGED_IN) {
                win();
            } else {
                fail();
            }
        });
    }
}

export const resolveLoggedInStatus = () => {
    
    services.get('profile/get-profile')
        .then(({success, user}) => {

            if (success) {
                authenticate(user);
            } else {
                unauthenticate();
            }
        })
        .catch(() => {
            unauthenticate();
        })
}
