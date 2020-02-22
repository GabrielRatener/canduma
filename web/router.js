
import VueRouter from "vue-router";
import {pages} from "./components"
import {waitForLogin} from "./login"

export const routes = [
    {name: 'index', path: '/', component: pages.Index},
    {name: 'login', path: '/login', component: pages.Login},
    {name: 'signup', path: '/signup', component: pages.Signup},
    {name: 'profile', path: '/profile', component: pages.Profile}
];

export const loggedOutRoutes = ['index', 'login', 'signup'];

const router = new VueRouter({routes});

router.beforeEach((destination, origin, next) => {
    waitForLogin()
        .then(() => {

            next();
        }, (err) => {
            // TODO: save desired route for post-login

            if (loggedOutRoutes.includes(destination.name)) {
                next();
            } else {
                router.push('/login');
            }
        });
});

export default router;
