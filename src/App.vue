<script setup lang="ts">

import {provide, reactive} from 'vue'
import GlobalState from '@/util/global-state'
import AccountCredential from '@/storage/account-credential'
import AxiosRequest from '@/axios/axios-request'
import AxiosAuthorization from '@/axios/axios-authorization'

const authorization = reactive({
    isCompleted: false,
    isAuthorized: false
})
provide(GlobalState.authorization, authorization)
const account = reactive({
    id: null as string | null,
    username: null as string | null,
    nickname: null as string | null,
})
provide(GlobalState.account, account)

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
        authorization.isCompleted = true
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
                        authorization.isCompleted = true
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
        authorization.isCompleted = true
    }
}
const requestAccountMetadata = (token: string, allowRequest = false, allowLogin = false) => {
    AxiosRequest.account.get(token)
        .then((accountResponse) => {
            AxiosAuthorization.setToken(token)
            account.id = accountResponse.id
            account.nickname = accountResponse.nickname
            account.username = accountResponse.username
            authorization.isAuthorized = true
            authorization.isCompleted = true
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
