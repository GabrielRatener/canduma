
// all vue imports get imported through here...

import App from "./vue/app.vue"

import Profile from "./vue/pages/profile.vue"
import Index from "./vue/pages/index.vue"
import Login from "./vue/pages/login.vue"
import Signup from "./vue/pages/signup.vue"

import Responsive from "./vue/layouts/responsive.vue"

// later we can add element imports here...

// TODO: fragment pages into separate files to be loaded on-demand
const pages = {
    Profile,
    Index,
    Login,
    Signup
}

const layouts = {
    Responsive
}

const elements = {
    // declare elements here
};

export {App, pages, layouts, elements};
