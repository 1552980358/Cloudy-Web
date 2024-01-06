<script setup lang="ts">

import {inject, onMounted, ref} from 'vue'
import ConfigOwnerState from '../../setup-config-owner-state'
import SetupConfigOwnerPanel from '../../setup-config-owner-panel'

const setupConfigOwnerUiState = inject(ConfigOwnerState.uiState)
const fields = inject(ConfigOwnerState.fields)

const usernameFormatRegex = /[a-zA-Z]+([a-zA-Z\d-_.]*[a-zA-Z\d])*$/
const emailFormatRegex = /^[a-zA-Z\d.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?(?:\.[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?)*$/
const fieldRules = {
    usernameFormat: (value: string) => {
        return usernameFormatRegex.test(value) || 'error.format'
    },
    emailFormat: (value: string) => {
        return emailFormatRegex.test(value) || 'error.format'
    },
}

const username = ref()
const email = ref()

onMounted(() => {
    username.value.focus()
})

const onNextButtonClick = () => {
    if (fieldRules.emailFormat(fields.email) == true) {
        if (fieldRules.usernameFormat(fields.username) != true) {
            username.value.focus()
        } else {
            setupConfigOwnerUiState.panel = SetupConfigOwnerPanel.password
        }
    } else {
        email.value.focus()
    }
}
const onEmailFieldEnter = onNextButtonClick

</script>

<template>

    <v-card-title class="unselectable text-center">
        <i18n-t keypath="setup.config-owner.identity.title">
            <!--suppress VueUnrecognizedSlot -->
            <template v-slot:nickname>{{ fields.nickname }}</template>
        </i18n-t>
    </v-card-title>

    <v-card-text>

        <div class="unselectable text-subtitle-1 text-center">
            <i18n-t keypath="setup.config-owner.identity.text"></i18n-t>
        </div>

        <v-text-field v-model="fields.username"
                      :rules="[fieldRules.usernameFormat]"
                      class="mt-2"
                      hide-details="auto"
                      hint="hint"
                      ref="username"
                      variant="outlined">

            <template v-slot:label>
                <i18n-t keypath="setup.config-owner.identity.username.label"></i18n-t>
            </template>

            <template v-slot:message="{message}">
                <div class="unselectable">
                    <i18n-t :keypath="`setup.config-owner.identity.username.${message}`"></i18n-t>
                </div>
            </template>

        </v-text-field>

        <!--suppress HtmlUnknownBooleanAttribute -->
        <v-text-field v-model="fields.email"
                      @keyup.enter="onEmailFieldEnter"
                      :rules="[fieldRules.emailFormat]"
                      class="mt-2"
                      hide-details="auto"
                      hint="hint"
                      placeholder="example@domain.com"
                      ref="email"
                      variant="outlined">

            <template v-slot:label>
                <i18n-t keypath="setup.config-owner.identity.email.label"></i18n-t>
            </template>

            <template v-slot:message="{message}">
                <div class="unselectable">
                    <i18n-t :keypath="`setup.config-owner.identity.email.${message}`"></i18n-t>
                </div>
            </template>

        </v-text-field>

    </v-card-text>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="onNextButtonClick"
               variant="flat">
            <i18n-t keypath="setup.config-owner.identity.next"></i18n-t>
        </v-btn>

    </v-card-actions>

</template>

<style scoped>
</style>