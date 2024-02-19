<script setup lang="ts">

import scope from './setup-scope.ts';
import {reactive, ref} from 'vue'
import MaterialSymbol from '@/material-symbols/MaterialSymbol.vue'

const uiState = reactive({
    loading: false,
});
scope.uiState = uiState;

const secret = ref<string>();
scope.secret = secret;

</script>

<template>

    <v-app>

        <v-app-bar>

            <v-app-bar-nav-icon>
                <material-symbol icon="settings"
                                 fill>
                </material-symbol>
            </v-app-bar-nav-icon>

            <v-app-bar-title>
                <i18n-t keypath="setup.title"></i18n-t>
            </v-app-bar-title>

        </v-app-bar>

        <v-main class="d-flex justify-center align-center">
            <v-card :loading="uiState.loading"
                    width="50%"
                    max-width="480"
                    min-width="360">
                <router-view></router-view>
            </v-card>
        </v-main>

    </v-app>

</template>

<style scoped>
</style>