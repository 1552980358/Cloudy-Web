<script setup lang="ts">

import {inject, reactive} from 'vue'
import State from '../../setup-state'
import AxiosRequest from '@/axios/axios-request'
import SetupPanel from '@/router/route/setup/setup-panel'

const setupUiState = inject(State.uiState)
const setupSecret = inject(State.secret)
const uiState = reactive({
    secretVisibility: false,
    error: null as string | null,
})

const onVerifySetupSecret = () => {
    const secret = setupSecret.value
    if (!setupUiState.isLoading && !!secret) {
        setupUiState.isLoading = true

        AxiosRequest.setup.get(secret)
            .then((responseBody) => {
                uiState.error = null
                setupUiState.isLoading = false
                if (!responseBody.has_owner) {
                    setupUiState.panel = SetupPanel.ConfigOwner
                } else {
                    // has_owner is true
                    // TODO: To be planned
                }
            })
            .catch((error) => {
                if (!error.response) {
                    uiState.error = 'connection'
                } else {
                    switch (error.response.status) {
                        case 401: {
                            uiState.error = 'response.unauthorized'
                            break
                        }
                        case 405: {
                            uiState.error = 'response.method-not-allowed'
                            break
                        }
                    }
                }
                setupUiState.isLoading = false
            })
    }
}

</script>

<template>

    <v-card-title class="unselectable">
        <i18n-t keypath="setup.secret.title"></i18n-t>
    </v-card-title>

    <v-card-text>

        <div class="unselectable">

            <i18n-t keypath="setup.secret.text"></i18n-t>

        </div>

        <v-text-field v-model="setupSecret"
                      @keyup.enter="onVerifySetupSecret"
                      :disabled="setupUiState.isLoading"
                      :error="!!uiState.error"
                      :error-messages="uiState.error"
                      :type="uiState.secretVisibility ? 'text' : 'password'"
                      class="mt-2"
                      hide-details="auto"
                      variant="outlined">

            <template v-slot:message="{message}">
                <i18n-t :keypath="`setup.secret.error.${message}`"></i18n-t>
            </template>

            <template v-slot:label>
                <i18n-t keypath="setup.secret.label"></i18n-t>
            </template>

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">lock</span>
            </template>

            <template v-slot:append-inner>
                <v-btn @click="uiState.secretVisibility = !uiState.secretVisibility"
                       color="onSurface"
                       icon
                       variant="text">
                    <span class="material-symbols-rounded">
                        {{ uiState.secretVisibility ? 'visibility_off' : 'visibility' }}
                    </span>
                </v-btn>
            </template>

            <template v-slot:append>
                <v-btn color="onSurface"
                       icon
                       variant="text">

                    <span class="material-symbols-rounded">info</span>

                    <v-tooltip activator="parent"
                               location="bottom">

                        <i18n-t keypath="setup.secret.tooltip.text"></i18n-t>

                        <v-code class="d-inline">
                            <i18n-t keypath="setup.secret.tooltip.environment-variable"></i18n-t>
                        </v-code>

                    </v-tooltip>

                </v-btn>
            </template>

        </v-text-field>

    </v-card-text>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="onVerifySetupSecret"
               :disabled="setupUiState.isLoading"
               class="text-transform-none"
               variant="flat">
            <i18n-t keypath="setup.secret.next"></i18n-t>
        </v-btn>

    </v-card-actions>

</template>

<style scoped>
</style>