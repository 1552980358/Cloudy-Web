<script setup lang="ts">

import {inject, onMounted, reactive, ref} from 'vue'
import ConfigOwnerState from '../../setup-config-owner-state'
import SetupConfigOwnerPanel from '@/router/route/setup/component/config-owner/setup-config-owner-panel'

const setupConfigOwnerUiState = inject(ConfigOwnerState.uiState)

const fields = inject(ConfigOwnerState.fields)
const uiState = reactive({
    visibility: {
        password: false,
        confirm: false,
    }
})

const password = ref()
onMounted(() => {
    password.value.focus()
})

const passwordConfirm = ref()

const passwordLengthRegex = /^.{8,16}$/
const passwordFormatRegex = /(?=.*[A-Za-z])(?=.*\d)/
const passwordSymbolRegex = /^[a-zA-Z0-9!@#$%&*-_=.?]+$/
const fieldRules = {
    passwordLength: (value: string) => {
        return passwordLengthRegex.test(value) || 'error.length'
    },
    passwordFormat: (value: string) => {
        return passwordFormatRegex.test(value) || 'error.format'
    },
    passwordSymbol: (value: string) => {
        return passwordSymbolRegex.test(value) || 'error.symbol'
    },
    passwordConfirmMatch: (value: string) => {
        return value == fields.password || 'error.match'
    },
}

const onNextClick = () => {
    if (fieldRules.passwordLength(fields.password) == true &&
        fieldRules.passwordFormat(fields.password) == true &&
        fieldRules.passwordSymbol(fields.password) == true &&
        fields.password == passwordConfirm.value) {
        setupConfigOwnerUiState.panel = SetupConfigOwnerPanel.avatar
    }
}

const onConfirmEnter = onNextClick

</script>

<template>

    <v-card-title class="unselectable text-center">
        <i18n-t keypath="setup.config-owner.password.title"></i18n-t>
    </v-card-title>

    <v-card-text>

        <div class="text-subtitle-1 unselectable text-center">
            <i18n-t keypath="setup.config-owner.password.text"></i18n-t>
        </div>

        <v-text-field v-model="fields.password"
                      :rules="[fieldRules.passwordLength, fieldRules.passwordFormat, fieldRules.passwordSymbol]"
                      :type="uiState.visibility.password ? 'text' : 'password'"
                      hide-details="auto"
                      hint="hint"
                      ref="password"
                      variant="outlined">

            <template v-slot:label>
                <i18n-t keypath="setup.config-owner.password.password.label"></i18n-t>
            </template>

            <template v-slot:message="{message}">
                <i18n-t :keypath="`setup.config-owner.password.password.${message}`"></i18n-t>
            </template>

            <template v-slot:append-inner>
                <v-btn @click="uiState.visibility.password = !uiState.visibility.password"
                       color="onSurface"
                       icon
                       variant="text">
                    <span class="material-symbols-rounded">
                        {{ uiState.visibility.password ? 'visibility_off' : 'visibility' }}
                    </span>
                </v-btn>
            </template>

        </v-text-field>

        <v-text-field @keyup.enter="onConfirmEnter"
                      v-model="passwordConfirm"
                      :rules="[fieldRules.passwordConfirmMatch]"
                      :type="uiState.visibility.confirm ? 'text' : 'password'"
                      class="mt-2"
                      hide-details="auto"
                      hint="hint"
                      variant="outlined">

            <template v-slot:label>
                <i18n-t keypath="setup.config-owner.password.confirm.label"></i18n-t>
            </template>

            <template v-slot:message="{message}">
                <i18n-t :keypath="`setup.config-owner.password.confirm.${message}`"></i18n-t>
            </template>

            <template v-slot:append-inner>
                <v-btn @click="uiState.visibility.confirm = !uiState.visibility.confirm"
                       color="onSurface"
                       icon
                       variant="text">
                    <span class="material-symbols-rounded">
                        {{ uiState.visibility.confirm ? 'visibility_off' : 'visibility' }}
                    </span>
                </v-btn>
            </template>

        </v-text-field>

    </v-card-text>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn variant="flat">
            <i18n-t keypath="setup.config-owner.password.next"></i18n-t>
        </v-btn>

    </v-card-actions>

</template>

<style scoped>

</style>