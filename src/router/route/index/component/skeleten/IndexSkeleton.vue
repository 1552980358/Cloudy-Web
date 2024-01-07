<script setup lang="ts">

import { inject, watch } from 'vue'
import axios from 'axios'
import GlobalState from '@/util/global-state'
import { IndexUiState } from '../../index-state'
import IndexPanel from '../../index-panel'
import MaterialSymbols from '@/material-symbols/MaterialSymbols.vue'

const authorizationState = inject(GlobalState.authorization)
const account = inject(GlobalState.account)

const indexUiState = inject(IndexUiState)

const onAuthorizationCompleted = () => {
    if (authorizationState.isAuthorized) {
        // TODO: Route to home
    } else {
        indexUiState.panel = IndexPanel.Login
    }
    indexUiState.isLoading = false
}

if (!authorizationState.isCompleted) {
    const unwatch = watch(() => authorizationState.isCompleted, (isCompleted) => {
        if (isCompleted) {
            unwatch()
            onAuthorizationCompleted()
        }
    })
} else {
    onAuthorizationCompleted()
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
            <v-avatar class="unselectable" size="48">
                <v-img :src="`${axios.defaults.baseURL}account/${account.id}/avatar`"
                       draggable="false">
                    <template v-slot:placeholder>
                        <material-symbols size="avatar">account_circle</material-symbols>
                    </template>
                </v-img>
            </v-avatar>
        </template>

    </v-list-item>

</template>

<style scoped>
</style>