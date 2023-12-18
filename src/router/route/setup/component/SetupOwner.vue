<script setup lang="ts">

import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import axiosAuthorization from '@/axios/axios-authorization'
import SetupOwnerResponse from './setup-owner-response'
import UserCredential from '@/storage/UserCredential'

const {t} = useI18n()

const ownerMetadata = ref<SetupOwnerResponse>()
const avatar = ref<string>()
const password = ref<string>()

const isLoading = ref(false)

const startLogin = (password: string) => {
    if (!!password && !isLoading.value) {
        isLoading.value = true
        const username = ownerMetadata.value.username
        const postBody = {
            username: username,
            password: password
        }
        axios.post('auth', postBody)
            .then((response) => response.data)
            .then((jwt) => {
                axiosAuthorization(jwt)
                // Save to local storage
                UserCredential.write(jwt, username, password)
                // TODO: To be implemented
            })
            .catch(() => {
                exceptionUnauthorized.value = true
                isLoading.value = false
            })
    }
}

const exceptionUnauthorized = ref(false)

axios.get('setup/owner')
    .then((response) => response.data as SetupOwnerResponse)
    .then((setupOwnerResponse) => {
        avatar.value = `${axios.defaults.baseURL}account/${setupOwnerResponse.id}/avatar`
        ownerMetadata.value = setupOwnerResponse
    })

</script>

<template>

    <v-snackbar v-model="exceptionUnauthorized"
                color="error-container">
        <span class="text-error">
            {{ t('setup.owner.exception.unauthorized') }}
        </span>
    </v-snackbar>

    <v-avatar class="setup-owner-avatar position-relative text-center"
              size="84">

        <img v-if="!!ownerMetadata"
             :src="avatar"
             alt=""
             class="w-100 h-100">
        <span v-else
              class="material-symbols-rounded w-100 h-100 unselectable text-black">
                    account_circle
                </span>

    </v-avatar>

    <v-card-title v-if="!!ownerMetadata" class="text-center">

        {{ ownerMetadata.nickname }}

        <v-card-subtitle>
            {{ ownerMetadata.username }}
        </v-card-subtitle>

    </v-card-title>

    <v-card-text>

        <v-text-field v-model="password"
                      @keyup.enter="startLogin(password)"
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

        <v-btn @click="startLogin(password)"
               :disabled="!password || isLoading"
               :loading="isLoading"
               color="primary"
               variant="flat">
            {{ t('setup.owner.login') }}
        </v-btn>

    </v-card-actions>

</template>

<style scoped>

.setup-owner-avatar {
    left: 50%;
    transform: translateX(-50%);
}

.setup-owner-avatar span {
    font-size: 84px;
}

</style>