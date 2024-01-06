<script setup lang="ts">

import {provide, reactive} from 'vue'
import SetupConfigOwnerPanel from './setup-config-owner-panel'
import State from './setup-config-owner-state'
import Nickname from './component/nickname/SetupConfigOwnerNickname.vue'
import Identity from './component/identity/SetupConfigOwnerIdentity.vue'
import Password from './component/password/SetupConfigOwnerPassword.vue'
import Avatar from './component/avatar/SetupConfigOwnerAvatar.vue'
import Upload from './component/upload/SetupConfigOwnerUpload.vue'

const uiState = reactive({
    panel: SetupConfigOwnerPanel.nickname,
})
provide(State.uiState, uiState)

const fields = reactive({
    nickname: null,
    username: null,
    email: null,
    password: null,
    avatar: null,
})
provide(State.fields, fields)

</script>

<template>

    <v-window v-model="uiState.panel">

        <v-window-item :key="SetupConfigOwnerPanel.nickname">
            <nickname></nickname>
        </v-window-item>

        <v-window-item :key="SetupConfigOwnerPanel.identity">
            <identity></identity>
        </v-window-item>

        <v-window-item :key="SetupConfigOwnerPanel.password">
            <password></password>
        </v-window-item>

        <v-window-item :key="SetupConfigOwnerPanel.avatar">
            <avatar></avatar>
        </v-window-item>

        <v-window-item :key="SetupConfigOwnerPanel.upload">
            <upload></upload>
        </v-window-item>

    </v-window>

</template>

<style scoped>

</style>