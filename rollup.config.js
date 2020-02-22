
import commonJS from "rollup-plugin-commonjs"
import vuePlugin from "rollup-plugin-vue"

export default {
    input: 'web/main.js',

    plugins: [
        commonJS(),
        vuePlugin()
    ],

    output: {
        file: 'public/dist/main.js',
        format: 'iife',
        globals: {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'vuetify': 'Vuetify',
            'vue-the-mask': 'VueTheMask',
            'validator': 'validator'
        }
    },

    watch: {
        exclude: 'node_modules/**',
        include: [
            './web/*.js',
            './web/utils/*.js',
            './web/vue/*/*.vue',
            './web/vue/*.vue'
        ]
    }
}