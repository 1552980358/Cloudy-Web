<script setup lang="ts">

import {provide, reactive} from 'vue'
import IndexLogin from './component/login/IndexLogin.vue'
import IndexSkeleton from './component/skeleten/IndexSkeleton.vue'
import {IndexUiState} from './index-state'
import IndexPanel from './index-panel'

const uiState = reactive({
    isLoading: true,
    panel: 0,
})
provide(IndexUiState, uiState)

</script>

<template>

    <v-main>

        <v-container class="h-100 d-flex align-center justify-center">

            <v-card :loading="uiState.isLoading"
                    class="w-50"
                    max-width="480">

                <index-skeleton v-if="uiState.panel == IndexPanel.Skeleton">
                </index-skeleton>
                <index-login v-else-if="uiState.panel == IndexPanel.Login">
                </index-login>

            </v-card>

        </v-container>

    </v-main>

</template>

<style scoped>

.index-avatar span {
    font-size: 48px;
}

</style>