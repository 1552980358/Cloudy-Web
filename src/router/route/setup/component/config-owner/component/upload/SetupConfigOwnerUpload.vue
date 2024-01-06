<script setup lang="ts">

import {inject, reactive} from 'vue'
import SetupState from '../../../../setup-state'
import ConfigOwnerState from '../../setup-config-owner-state'
import AxiosRequest from '@/axios/axios-request'
import {useRouter} from 'vue-router'

const setupUiState = inject(SetupState.uiState)
const setupSecret = inject(SetupState.secret)
const fields = inject(ConfigOwnerState.fields)

const uiState = reactive({
    error: null as string | null,
    retry: false,
})

const secret = setupSecret.value
const username = fields.username
const email = fields.email
const password = fields.password
const nickname = fields.nickname
const avatar = fields.avatar

const uploadOwnerConfigurations = () => {
    setupUiState.isLoading = true
    uiState.error = null

    AxiosRequest.setup.owner
        .post(secret, username, email, password, nickname, avatar)
        .then(() => {
            setupUiState.isLoading = false
            // TODO: Redirect to login page
        })
        .catch((error) => {
            if (!error.response) {
                uiState.retry = true
                uiState.error = 'connection'
            } else {
                switch (error.response.status) {
                    case 400: {
                        uiState.retry = true
                        uiState.error = 'response.bad-request'
                        break
                    }
                    case 401: {
                        uiState.error = 'response.unauthorized'
                        break
                    }
                    case 403: {
                        uiState.error = 'response.forbidden'
                        break
                    }
                    case 405: {
                        uiState.error = 'response.method-not-allowed'
                        break
                    }
                    case 500: {
                        uiState.retry = true
                        uiState.error = 'response.internal-server-error'
                        break
                    }
                }
            }
            setupUiState.isLoading = false
        })
}


const onRetryClick = () => {
    if (uiState.retry) {
        uiState.retry = false
        uploadOwnerConfigurations()
    }
}

const router = useRouter()
const onLoginClick = () => {
    router.replace('/')
}

uploadOwnerConfigurations()

</script>

<template>

    <v-card-title>
        <i18n-t v-if="setupUiState.isLoading"
                keypath="setup.config-owner.upload.uploading.title">
        </i18n-t>
        <i18n-t v-else-if="!uiState.error"
                keypath="setup.config-owner.upload.success.title">
        </i18n-t>
        <i18n-t v-else
                keypath="setup.config-owner.upload.error.title">
        </i18n-t>
    </v-card-title>

    <v-card-text class="text-center">
        <i18n-t v-if="setupUiState.isLoading"
                keypath="setup.config-owner.upload.uploading.text">
        </i18n-t>
        <i18n-t v-else-if="!uiState.error"
                keypath="setup.config-owner.upload.success.text">
        </i18n-t>
        <i18n-t v-else
                :keypath="`setup.config-owner.upload.error.error.${uiState.error}`">
        </i18n-t>
    </v-card-text>

    <v-card-actions v-if="!setupUiState.isLoading">

        <v-spacer></v-spacer>

        <v-btn v-if="uiState.error"
               @click="onRetryClick"
               variant="flat">
            <i18n-t keypath="setup.config-owner.upload.error.retry"></i18n-t>
        </v-btn>
        <v-btn v-else
               @click="onLoginClick"
               variant="flat">
            <i18n-t keypath="setup.config-owner.upload.login"></i18n-t>
        </v-btn>

    </v-card-actions>

</template>

<style scoped>

</style>