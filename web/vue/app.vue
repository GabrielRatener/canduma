<template lang="pug">
    v-app
        //- TODO: v-navigation-drawer
        v-app-bar(app dark color="white")
            router-link(to="/")
                img.mr-1(height="40" :src="'logo.png' | image")
            v-toolbar-items.d-none.d-md-block(v-if="loggedIn")
                v-btn(
                    text
                    v-for="(route, i) in navigation"
                    color="black"
                    :key="i"
                    :to="route.path"
                    ) {{route.title}}
                
            v-spacer
            v-toolbar-items(v-if="!loggedIn")
                v-btn(
                    text
                    color="black"
                    to="/signup"
                    ) Sign Up
                v-btn(
                    text
                    color="black"
                    to="/login"
                    ) Log In

            v-toolbar-items.d-none.d-md-block(v-if="loggedIn")
                v-btn(
                    text
                    color="black"
                    @click="logOut()"
                    ) Log Out


            v-btn.d-md-none(fab small @click="drawer = !drawer" v-if="loggedIn")
                v-icon menu

        v-content
            v-navigation-drawer(
                absolute
                temporary
                height="100%"
                v-if="loggedIn"
                v-model="drawer"
                )
                v-list
                    v-list-item(
                        v-for="(route, i) in navigation"
                        :key="i"
                        :to="route.path"
                        )
                        v-list-item-content
                            v-list-item-title {{route.title}}

                template(slot="append")
                    div.pa-2
                        v-btn(block @click="logOut()") Log Out


            v-container(fluid)
                v-layout(align-center justify-center)
                    router-view(:key="$route.fullPath")


</template>
<style lang="scss">

    // styling goes here...

</style>
<script lang="defscript">

    import {mapGetters} from "vuex"
    import {logOut} from "../login"

    export default {
        data() {
            return {
                // is navigation drawer open (on relevant screen sizes)
                drawer: false,

                navigation: [
                    // logged-in navigation items go here...
                    {
                        title: "Profile",
                        path: '/profile'
                    }
                ]
            }
        },

        methods: {
            logOut() {
                this.drawer = false;

                logOut();

                this.$router.replace('/');
            }
        },

        computed: {
            ...mapGetters(['loggedIn'])
        }
    }
</script>