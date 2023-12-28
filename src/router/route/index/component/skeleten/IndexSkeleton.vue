<script setup lang="ts">

import {inject, reactive, watch} from 'vue'
import {IndexUiState} from '../../index-key'
import axios from 'axios'
import {Authorization} from '@/util/global-state'
import IndexAccountResponse from '../../index-account-response'

const indexUiState = inject(IndexUiState)

const uiState = reactive({
    defaultAvatar: false,
})
const account = reactive({
    nickname: null,
    username: null,
    id: null,
})

const checkAuthState = () => {
    if (authorizationState.isAuthorized) {
        requestAccountMetadata(true)
    } else {
        moveToLogin()
    }
}

const retryOrMoveToLogin = (allowRetry: boolean) => {
    if (allowRetry) {
        requestAccountMetadata()
    } else {
        moveToLogin()
    }
}

const requestAccountMetadata = (allowRetry = false) => {
    axios.get('account')
        .then((response) => response.data as IndexAccountResponse)
        .then((indexAccountResponse) => {
            account.nickname = indexAccountResponse.nickname
            account.username = indexAccountResponse.username
            account.id = indexAccountResponse.id
            indexUiState.isLoading = false
            // TODO: To be implemented
        })
        .catch((error) => {
            if (!error.response) {
                retryOrMoveToLogin(allowRetry)
            } else {
                switch (error.response.status) {
                    case 401: {
                        // Authorization should be handled by `App.vue`
                        // So, handling re-login is not required here
                        // Just move to login page for human handling
                        moveToLogin()
                        break
                    }
                    case 500: {
                        retryOrMoveToLogin(allowRetry)
                        break
                    }
                }
            }
        })
}

const moveToLogin = () => {
    indexUiState.isLoading = false
    indexUiState.panel = 1
}

const authorizationState = inject(Authorization)
if (authorizationState.isCompleted) {
    checkAuthState()
} else {
    // Let's watch until `App.vue`'s auth checking is done
    const unwatch = watch(() => authorizationState.isCompleted, (isCompleted) => {
        if (isCompleted) {
            checkAuthState()
            unwatch()
        }
    })
}

</script>

<template>

    <v-card-title class="unselectable">
        <i18n-t :keypath="`index.skeleton.title.${indexUiState.isLoading ? 'retrieve-metadata' : 'welcome-back'}`">
        </i18n-t>
    </v-card-title>

    <v-skeleton-loader v-if="indexUiState.isLoading"
                       type="list-item-avatar-two-line">
    </v-skeleton-loader>
    <v-list-item v-else
                 :title="account.nickname"
                 :subtitle="`@${account.username}`"
                 class="unselectable"
                 lines="two">

        <template v-slot:prepend>

            <v-avatar class="index-skeleton-avatar unselectable" size="48">

                <v-img v-if="!uiState.defaultAvatar"
                       @error="uiState.defaultAvatar = true"
                       :src="`${axios.defaults.baseURL}account/${account.id}/avatar`"
                       class="w-100 h-100 unselectable"
                       draggable="false">
                </v-img>
                <span v-else
                      class="material-symbols-rounded material-avatar text-black">
                    account_circle
                </span>

            </v-avatar>

        </template>

    </v-list-item>

</template>

<style scoped>
</style>