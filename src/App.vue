<script setup lang="ts">

import {provide, reactive} from 'vue'
import {Authorization} from '@/util/global-state'
import AccountCredential from '@/storage/account-credential'
import axios from 'axios'
import AxiosAuthorization from '@/axios/axios-authorization'

const authorizationState = reactive({
    isCompleted: false,
    isAuthorized: false
})
provide(Authorization, authorizationState)

const retryAccountLoginOrComplete = (allowRetry: boolean) => {
    if (allowRetry) {
        accountLogin()
    } else {
        authorizationState.isCompleted = true
    }
}

const accountLogin = (allowRetry = false) => {
    const postBody = {
        username: accountCredential.username,
        password: accountCredential.password,
    }
    axios.post(`auth`, postBody)
        .then((response) => response.data as string)
        .then((token) => {
            accountCredential.token = token
            AxiosAuthorization.setToken(token)
            authorizationState.isAuthorized = true
            authorizationState.isCompleted = true
        })
        .catch((error) => {
            if (!error.response) {
                retryAccountLoginOrComplete(allowRetry)
            } else {
                switch (error.response.status) {
                    case 401: {
                        authorizationState.isCompleted = true
                        break
                    }
                    case 500: {
                        retryAccountLoginOrComplete(allowRetry)
                        break
                    }
                }
            }
        })
}

const retryVerifyAuthorizationOrComplete = (allowRetry: boolean) => {
    if (allowRetry) {
        verifyAuthorization()
    } else {
        authorizationState.isCompleted = true
    }
}

const verifyAuthorization = (allowRetry = false) => {
    axios.get('auth', accountCredential.headerOption)
        .then(() => {
            AxiosAuthorization.setToken(accountCredential.token)
            authorizationState.isAuthorized = true
            authorizationState.isCompleted = true
        })
        .catch((error) => {
            if (!error.response) {
                retryVerifyAuthorizationOrComplete(allowRetry)
            } else {
                switch (error.response.status) {
                    case 401: {
                        // Status 401: Might be token is expired
                        // Try to log in if account username & password is available
                        if (!!accountCredential.username && !!accountCredential.password) {
                            accountLogin(true)
                        }
                        break
                    }
                    default: {
                        retryVerifyAuthorizationOrComplete(allowRetry)
                        break
                    }
                }
            }
        })
}

const accountCredential = AccountCredential.read()
if (!!accountCredential.token) {
    verifyAuthorization(true)
} else {
    authorizationState.isCompleted = true
}

</script>

<template>
    <v-app>
        <router-view></router-view>
    </v-app>
</template>

<style>
</style>
