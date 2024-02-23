<script setup lang="ts">

import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import MaterialSymbol from '@/material-symbols/MaterialSymbol.vue';
import setupScope from '../setup-scope.ts';
import verifySecret from './verify-secret.ts';

const router = useRouter();

const setupUiState = setupScope.uiState;
const setupSecret = setupScope.secret;

const uiState = reactive({
    visibility: false,
    error: null as string,
});

const onVerifySecretCompleted = (hasOwner: boolean | null) => {
    setupUiState.loading = false;
    // Ignore null value (=> error)
    if (hasOwner != null) {
        if (hasOwner) {
            // TODO
        } else {
            // TODO
        }
    }
};

const doVerifySecret = () => {
    const secret = setupSecret.value;
    if (!!secret && !setupUiState.loading) {
        setupUiState.loading = true;
        uiState.error = null;
        verifySecret(secret, uiState, onVerifySecretCompleted);
    }
};

</script>

<template>

    <v-card-title>
        <i18n-t keypath="setup.secret.title"></i18n-t>
    </v-card-title>

    <v-card-text>

        <i18n-t keypath="setup.secret.content"></i18n-t>

        <v-text-field v-model="setupSecret"
                      @keyup.enter="doVerifySecret"
                      :disabled="setupUiState.loading"
                      :error="!!uiState.error"
                      :error-messages="uiState.error"
                      :type="uiState.visibility ? 'text' : 'password'"
                      class="mt-2"
                      hint="field.hint"
                      persistent-hint>

            <template v-slot:prepend-inner>
                <material-symbol>lock</material-symbol>
            </template>

            <template v-slot:append-inner>
                <v-btn @click="uiState.visibility = !uiState.visibility"
                       color="on-surface-variant"
                       icon=""
                       variant="text">
                    <material-symbol>
                        {{ uiState.visibility ? 'visibility_off' : 'visibility' }}
                    </material-symbol>
                </v-btn>
            </template>

            <template v-slot:message="{ message }">
                <i18n-t v-if="uiState.error"
                        :keypath="`setup.secret.error.${message}`">
                </i18n-t>
                <i18n-t v-else
                        :keypath="`setup.secret.${message}`">
                </i18n-t>
            </template>

            <template v-slot:append>
                <v-btn color="on-surface-variant"
                       icon=""
                       variant="text">

                    <material-symbol>info</material-symbol>

                    <v-tooltip activator="parent"
                               location="bottom">
                        <i18n-t keypath="setup.secret.field.tooltip"></i18n-t>
                        <v-code class="d-inline">CLOUDY_SETUP_SECRET</v-code>
                    </v-tooltip>

                </v-btn>
            </template>

        </v-text-field>

    </v-card-text>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="doVerifySecret"
               :disabled="setupUiState.loading"
               class="text-transform-none"
               variant="flat">
            <i18n-t keypath="setup.secret.button.verify"></i18n-t>
        </v-btn>

    </v-card-actions>

</template>

<style scoped>

</style>