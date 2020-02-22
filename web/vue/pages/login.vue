<template lang="pug">
    rbp-layout-responsive(heading="Log In" align)
        v-form
            v-text-field(
                label="Email"
                v-model="auth.email"
                prepend-icon="person"
                )
            v-text-field(
                prepend-icon="lock"
                :append-icon="auth.visible ? 'visibility': 'visibility_off'"

                label="Password"
                :type="auth.visible ? 'text': 'password' "
                v-model="auth.password"
                @click:append="auth.visible = !auth.visible"
                )
            v-btn(@click="submit()" color="primary") Log In
            router-link.float-right(to='/signup') 
                Dont have an account? Sign up
            v-spacer
                p 

    
</template>

<script>

import {logIn} from "../../login"

export default {
    data: () => ({
        auth: {
            email: "",
            password: "",
            visible: false
        }
    }),
    methods: {
        submit() {

            logIn({
                email: this.auth.email,
                password: this.auth.password,
            })
            .then(() => {
                this.$router.replace('/profile');
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>