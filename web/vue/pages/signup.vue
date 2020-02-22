<template lang="pug">
    rbp-layout-responsive(heading="Sign Up" align)
        v-form(
            v-model="valid"
            lazy-validation
        )
            v-text-field(
                prepend-icon="person"
                label="Full Name"
                v-model="auth.name"
            )
            v-text-field(
                prepend-icon="person"
                label="Email"
                v-model="auth.email"
                :rule="auth.emailRules"
            )
            v-row
                v-col(cols="12" sm="6")
                    v-text-field(
                        prepend-icon="lock"
                        :append-icon="auth.visible ? 'visibility': 'visibility_off'"
                        label="Password"
                        :type="auth.visible ? 'text': 'password' "
                        v-model="auth.password"
                        :rules="auth.passwordRules"
                        @click:append="auth.visible = !auth.visible"
                        )
                v-col(cols="12" sm="6")
                    v-text-field(
                        prepend-icon="lock"
                        :append-icon="auth.visible ? 'visibility': 'visibility_off'"
                        label="Confirm Password"
                        :type="auth.visible ? 'text': 'password' "
                        v-model="auth.confirmPassword"
                        :rules="auth.passwordMatch"
                        @click:append="auth.visible = !auth.visible"
                        )
            v-cols(cols="12" sm="6")
                v-text-field(
                    prepend-icon="phone"
                    label="Phone Number"
                    v-model="auth.phone"
                    v-mask="'+1(###)-###-####'"
                )
            v-btn(
                color="success"
                @click="submit()" ) Sign Up
            router-link.float-right(to='/login') Log in instead
            v-spacer
                p

        
</template>

<script>

import validator from "validator"

import {
    passwordTests, 
    testUserName,
    extractDigits,
    MAX_NAME_LENGTH
} from '../../utils'

import {signUp} from "../../login"

export default {
    data: () => ({
        auth: {
            valid: true,
            name: "",
            email: "",
            nameRules: testUserName,
            emailRules: [ 
                v => !!v || "Email is required", 
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ],
            password: "",
            passwordRules: passwordTests.map(line => { 
                return (v) => line.test(v) ? true : line.description ;
                }),
            confirmPassword: "",
            passwordMatch: [v => !!v],
            phone: "",
            visible: false
        },
        rules: {

        }
    }),
    methods: {
        submit() {
            const data = {
                name: this.auth.name,
                email: this.auth.email,
                password: this.auth.password,
                phone:
                    extractDigits(this.auth.phone)
                        .slice(-10)
            };
            
            signUp(data)
                .then(() => {
                    this.$router.replace('/profile');
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
}
</script>