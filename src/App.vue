<script setup lang="ts">

import {provide, reactive} from 'vue'
import {Account, Authorization} from '@/util/global-state'
import AccountCredential from '@/storage/account-credential'
import AxiosRequest from '@/axios/axios-request'
import AxiosAuthorization from '@/axios/axios-authorization'

const authorizationState = reactive({
    isCompleted: false,
    isAuthorized: false
})
provide(Authorization, authorizationState)
const accountState = reactive({
    id: null as string | null,
    username: null as string | null,
    nickname: null as string | null,
})
provide(Account, accountState)

const clearToken = () => {
    if (!!accountCredential.token) {
        accountCredential.token = null
    }
}

const accountLoginOrComplete = (allowRequest: boolean, allowLogin: boolean) => {
    if (allowLogin) {
        accountLogin(allowRequest, false)
    } else {
        clearToken()
        authorizationState.isCompleted = true
    }
}

const accountLogin = (allowRequest: boolean, allowLogin: boolean) => {
    AxiosRequest.auth.post(accountCredential.username, accountCredential.password)
        .then((token) => {
            requestAccountMetadata(token, true)
        })
        .catch((error) => {
            if (!error.response) {
                accountLoginOrComplete(allowRequest, allowLogin)
            } else {
                switch (error.response.status) {
                    case 401: {
                        clearToken()
                        authorizationState.isCompleted = true
                        break
                    }
                    case 500: {
                        accountLoginOrComplete(allowRequest, allowLogin)
                        break
                    }
                }
            }
        })
}

const requestAccountMetadataOrComplete = (token: string, allowRequest: boolean, allowLogin: boolean) => {
    if (allowRequest) {
        requestAccountMetadata(token, false, allowLogin)
    } else {
        clearToken()
        authorizationState.isCompleted = true
    }
}
const requestAccountMetadata = (token: string, allowRequest = false, allowLogin = false) => {
    AxiosRequest.account.get(token)
        .then((accountResponse) => {
            AxiosAuthorization.setToken(token)
            accountState.id = accountResponse.id
            accountState.nickname = accountResponse.nickname
            accountState.username = accountResponse.username
            authorizationState.isAuthorized = true
            authorizationState.isCompleted = true
        })
        .catch((error) => {
            if (!error.response) {
                requestAccountMetadataOrComplete(token, allowRequest, allowLogin)
            } else {
                switch (error.response.status) {
                    case 401: {
                        break
                    }
                    case 400:
                    case 500: {
                        requestAccountMetadataOrComplete(token, allowRequest, allowLogin)
                        break
                    }
                }
            }
        })
}

const accountCredential = AccountCredential.read()
requestAccountMetadata(accountCredential.token, true, true)

</script>

<template>
    <v-app>
        <router-view></router-view>
    </v-app>
</template>

<style>
</style>
