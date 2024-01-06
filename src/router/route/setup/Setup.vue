<script setup lang="ts">

import {provide, reactive, ref} from 'vue'
import SetupState from '@/router/route/setup/setup-state'
import SetupSecret from './component/secret/SetupSecret.vue'
import SetupPanel from '@/router/route/setup/setup-panel'
import SetupConfigOnwer from '@/router/route/setup/component/config-owner/SetupConfigOwner.vue'

const setupSecret = ref<string>()
provide(SetupState.secret, setupSecret)

const uiState = reactive({
    isLoading: false,
    panel: SetupPanel.Secret,
})
provide(SetupState.uiState, uiState)

</script>

<template>

    <v-layout>

        <v-app-bar>

            <v-app-bar-nav-icon>
                <span class="material-symbols-rounded">settings</span>
            </v-app-bar-nav-icon>

            <v-toolbar-title class="unselectable">
                <i18n-t keypath="setup.title"></i18n-t>
            </v-toolbar-title>

        </v-app-bar>

        <v-main>

            <v-container class="w-100 h-100 d-flex justify-center align-center">

                <v-card :loading="uiState.isLoading"
                        class="w-50"
                        max-width="480"
                        min-width="320" >

                    <v-fade-transition>
                        <setup-secret v-if="uiState.panel == SetupPanel.Secret"></setup-secret>
                        <setup-config-onwer v-else-if="uiState.panel == SetupPanel.ConfigOwner"></setup-config-onwer>
                    </v-fade-transition>

                </v-card>

            </v-container>

        </v-main>

    </v-layout>

</template>

<style scoped>
</style>