<script setup lang="ts">

import {computed, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import AxiosAuthorization from '@/axios/axios-authorization'
import SetupOwnerResponse from './setup-owner-response'
import UserCredential from '@/storage/user-credential'

const {t} = useI18n()

const uiState = reactive({
    isLoading: false,
    defaultAvatar: false,

    /** Errors **/
    errorUnauthorized: false,
})

const ownerCredential = reactive({
    metadata: null,
    password: null,
})

const isLoading = computed(() => uiState.isLoading)
const defaultAvatar = computed({
    set: (value) => uiState.defaultAvatar = value,
    get: () => uiState.defaultAvatar,
})
const ownerMetadata = computed(() => ownerCredential.metadata as SetupOwnerResponse)
const password = computed({
    set: (value) => ownerCredential.password = value,
    get: () => ownerCredential.password,
})
const errorUnauthorized = computed({
    set: (value) => uiState.errorUnauthorized = value,
    get: () => uiState.errorUnauthorized,
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
                UserCredential.write(jwt, username, password)
                // TODO: To be implemented
            })
            .catch(() => {
                uiState.errorUnauthorized = true
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

    <v-snackbar v-model="errorUnauthorized"
                color="error-container">
        <span class="text-error">
            {{ t('setup.owner.exception.unauthorized') }}
        </span>
    </v-snackbar>

    <div class="d-flex justify-center">

        <v-avatar class="setup-owner-avatar" size="84">

            <img v-if="!!ownerMetadata && !defaultAvatar"
                 :src="`${axios.defaults.baseURL}account/${ownerMetadata.id}/avatar`"
                 @error="defaultAvatar = true"
                 alt=""
                 class="w-100 h-100">
            <span v-else
                  class="material-symbols-rounded w-100 h-100 unselectable text-black">
                account_circle
            </span>

        </v-avatar>

    </div>

    <v-card-title v-if="!!ownerMetadata" class="text-center">

        {{ ownerMetadata.nickname }}

        <v-card-subtitle>
            {{ ownerMetadata.username }}
        </v-card-subtitle>

    </v-card-title>

    <v-card-text>

        <v-text-field v-model="password"
                      @keyup.enter="startLogin"
                      :disabled="isLoading"
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
               :disabled="!password || isLoading"
               :loading="isLoading"
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