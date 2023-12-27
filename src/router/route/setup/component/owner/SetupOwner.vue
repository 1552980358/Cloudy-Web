<script setup lang="ts">

import {reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import AxiosAuthorization from '@/axios/axios-authorization'
import SetupOwnerResponse from './setup-owner-response'
import AccountCredential from '@/storage/account-credential'

const {t} = useI18n()

const uiState = reactive({
    isLoading: false,
    defaultAvatar: false,

    /** Errors **/
    exceptionUnauthorized: false,
})

const ownerCredential = reactive({
    metadata: null as SetupOwnerResponse,
    password: null,
})

const startLogin = () => {
    const password = ownerCredential.password
    if (!!password && !uiState.isLoading) {
        uiState.isLoading = true
        const username = ownerCredential.metadata.username
        const postBody = {
            username: username,
            password: password
        }
        axios.post('auth', postBody)
            .then((response) => response.data)
            .then((jwt) => {
                AxiosAuthorization.setToken(jwt)
                // Save to local storage
                AccountCredential.write(jwt, username, password)
                // TODO: To be implemented
            })
            .catch(() => {
                uiState.exceptionUnauthorized = true
                uiState.isLoading = false
            })
    }
}

axios.get('setup/owner')
    .then((response) => response.data as SetupOwnerResponse)
    .then((setupOwnerResponse) => {
        ownerCredential.metadata = setupOwnerResponse
    })

</script>

<template>

    <v-snackbar v-model="uiState.exceptionUnauthorized"
                color="error-container">
        <span class="text-error">
            {{ t('setup.owner.exception.unauthorized') }}
        </span>
    </v-snackbar>

    <div class="d-flex justify-center">

        <v-avatar class="setup-owner-avatar" size="84">

            <img v-if="!!ownerCredential.metadata && !uiState.defaultAvatar"
                 :src="`${axios.defaults.baseURL}account/${ownerCredential.metadata.id}/avatar`"
                 @error="uiState.defaultAvatar = true"
                 alt=""
                 class="w-100 h-100">
            <span v-else
                  class="material-symbols-rounded w-100 h-100 unselectable text-black">
                account_circle
            </span>

        </v-avatar>

    </div>

    <v-card-title v-if="!!ownerCredential.metadata" class="text-center">

        {{ ownerCredential.metadata.nickname }}

        <v-card-subtitle>
            {{ ownerCredential.metadata.username }}
        </v-card-subtitle>

    </v-card-title>

    <v-card-text>

        <v-text-field v-model="ownerCredential.password"
                      @keyup.enter="startLogin"
                      :disabled="uiState.isLoading"
                      :label="t('setup.owner.password')"
                      class="mt-2 pb-0"
                      hide-details="auto"
                      type="password"
                      variant="outlined">

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">lock</span>
            </template>

        </v-text-field>

    </v-card-text>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="startLogin"
               :disabled="!ownerCredential.password || uiState.isLoading"
               :loading="uiState.isLoading"
               color="primary"
               variant="flat">
            {{ t('setup.owner.login') }}
        </v-btn>

    </v-card-actions>

</template>

<style scoped>

.setup-owner-avatar span {
    font-size: 84px;
}

</style>