<script setup lang="ts">

import {inject} from 'vue'
import ConfigOwnerState from '../../setup-config-owner-state'
import SetupConfigOwnerPanel from '../../setup-config-owner-panel'

const setupConfigOwnerUiState = inject(ConfigOwnerState.uiState)
const fields = inject(ConfigOwnerState.fields)

const navigateToAuthentication = () => {
    if (!!fields.nickname) {
        setupConfigOwnerUiState.panel = SetupConfigOwnerPanel.identity
    }
}

</script>

<template>

    <v-card-title class="unselectable">
        <i18n-t keypath="setup.config-owner.title"></i18n-t>
    </v-card-title>

    <v-card-text>

        <i18n-t keypath="setup.config-owner.nickname.text"></i18n-t>

        <v-text-field v-model="fields.nickname"
                      @keyup.enter="navigateToAuthentication"
                      class="mt-1"
                      hide-details
                      variant="outlined">

            <template v-slot:label>
                <i18n-t keypath="setup.config-owner.nickname.label"></i18n-t>
            </template>

        </v-text-field>

    </v-card-text>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="navigateToAuthentication"
               :disabled="!fields.nickname"
               class="text-transform-none"
               variant="flat">

            <i18n-t keypath="setup.config-owner.nickname.next"></i18n-t>

        </v-btn>

    </v-card-actions>

</template>

<style scoped>

</style>