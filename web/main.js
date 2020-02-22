
import Vue from "vue"
import Vuetify from "vuetify"
import VueTheMask from 'vue-the-mask'
import vuex from "vuex"

import store from "./store"
import router from "./router"
import {resolveLoggedInStatus} from "./login"

import {App, layouts, elements} from "./components"

// the namespace to use for your custom elements
const ns = 'Rbp';

Vue.use(vuex);
Vue.use(Vuetify);
Vue.use(VueTheMask);

Vue.filter('image', (subPath) => {
    return `assets/images/${subPath}`;
});

// register the layouts as global components
Object.entries(layouts)
    .forEach(([name, component]) => {
        Vue.component(`${ns}Layout${name}`, component);
    });

// register the layouts as global components
Object.entries(elements)
    .forEach(([name, component]) => {
        Vue.component(`${ns}${name}`, component);
    });


window.onload = () => {
    const app = new Vue({
        el: '#app-mount',

        router,
        store,

        vuetify: new Vuetify(),

        render(renderer) {

            return renderer(App);
        },

        created() {

            resolveLoggedInStatus();
        }
    });
}
