<script setup lang="ts">

import {inject, reactive, watch} from 'vue'
import {IndexUiState} from '../../index-key'
import axios from 'axios'
import {Account, Authorization} from '@/util/global-state'

const authorizationState = inject(Authorization)
const accountState = inject(Account)

const indexUiState = inject(IndexUiState)

const uiState = reactive({ defaultAvatar: false })

const onAuthorizationCompleted = () => {
    if (authorizationState.isAuthorized) {
        // TODO: Route to home
    } else {
        indexUiState.panel = 1
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
                 :title="accountState.nickname"
                 :subtitle="`@${accountState.username}`"
                 class="unselectable"
                 lines="two">

        <template v-slot:prepend>

            <v-avatar class="index-skeleton-avatar unselectable" size="48">

                <v-img v-if="!uiState.defaultAvatar"
                       @error="uiState.defaultAvatar = true"
                       :src="`${axios.defaults.baseURL}account/${accountState.id}/avatar`"
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