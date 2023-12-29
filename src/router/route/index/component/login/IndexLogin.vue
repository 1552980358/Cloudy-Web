<script setup lang="ts">

import {inject, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import AccountCredential from '@/storage/account-credential'
import {IndexUiState} from '../../index-key'
import axios from 'axios'
import IndexAccountResponse from '@/router/route/index/index-account-response'
import AxiosAuthorization from '@/axios/axios-authorization'
import {Authorization} from '@/util/global-state'

const  {t} = useI18n()

const authorizationState = inject(Authorization)
const indexUiState = inject(IndexUiState)
const uiState = reactive({
    window: 0,
    password:{
        defaultAvatar: false,
        visibility: false,
    },
    error: {
        username: null,
        password: null,
    }
})

const accountCredential = AccountCredential.read()
const account = reactive({
    username: accountCredential.username,
    id: null,
    nickname: null,
    password: accountCredential.password,
    duration: 0,
    oneTimeLogin: false,
})

const durationList = [1, 3, 7, 15, 30, 180, 365]

const accountMetadata = () => {
    if (!indexUiState.isLoading && !!account.username) {
        indexUiState.isLoading = true

        axios.get(`account/username/${account.username}`)
            .then((response) => response.data as IndexAccountResponse)
            .then((indexAccountResponse) => {
                account.id = indexAccountResponse.id
                account.nickname = indexAccountResponse.nickname
                uiState.error.username = null
                indexUiState.isLoading = false
                uiState.window = 1
            })
            .catch((error) => {
                let errorKeyPath = null as string | null
                if (!error.response) {
                    errorKeyPath = 'index.login.username.error.request.connection'
                } else {
                    switch (error.response.status) {
                        case 404: {
                            errorKeyPath = 'index.login.username.error.response.not-found'
                            break
                        }
                        case 500: {
                            errorKeyPath = 'index.login.username.error.response.internal-server-error'
                            break
                        }
                    }
                }
                if (!!errorKeyPath) {
                    uiState.error.username = t(errorKeyPath)
                }
                indexUiState.isLoading = false
            })
    }
}

const accountLogin = () => {
    if (!indexUiState.isLoading && !!account.password) {
        indexUiState.isLoading = true

        const urlSuffix = account.oneTimeLogin ? `?duration=${durationList[account.duration] * 24 * 60 * 60}` : ''
        const postBody = {
            username: account.username,
            password: account.password,
        }
        axios.post(`auth${urlSuffix}`, postBody)
            .then((response) => response.data as string)
            .then((token) => {
                AxiosAuthorization.setToken(token)
                authorizationState.isAuthorized = true
                if (account.oneTimeLogin) {
                    accountCredential.token = token
                } else {
                    accountCredential.setCredential(token, account.username, account.password)
                }
                indexUiState.isLoading = false
                // TODO: To be implemented
            })
            .catch((error) => {
                let errorKeyPath = null as string | null
                if (!error.response) {
                    errorKeyPath = 'index.login.password.error.request.connection'
                } else {
                    switch (error.response.status) {
                        case 401: {
                            errorKeyPath = 'index.login.password.error.response.unauthorized'
                            break
                        }
                        case 500: {
                            errorKeyPath = 'index.login.password.error.response.internal-server-error'
                            break
                        }
                    }
                }
                if (!!errorKeyPath) {
                    uiState.error.password = t(errorKeyPath)
                }
                indexUiState.isLoading = false
            })
    }
}

</script>

<template>

    <v-window v-model="uiState.window">

        <!-- Username -->
        <v-window-item :key="0">

            <v-card-title class="text-center unselectable">
                <i18n-t keypath="index.login.username.title"></i18n-t>
            </v-card-title>

            <v-card-text>

                <div class="unselectable">
                    <i18n-t keypath="index.login.username.text"></i18n-t>
                </div>

                <v-text-field v-model="account.username"
                              @keyup.enter="accountMetadata"
                              :disabled="indexUiState.isLoading"
                              :error="!!uiState.error.username"
                              :error-messages="uiState.error.username"
                              class="mt-2"
                              hide-details="auto"
                              variant="outlined">

                    <template v-slot:label>
                        <i18n-t keypath="index.login.username.label"></i18n-t>
                    </template>

                </v-text-field>

            </v-card-text>

            <v-card-actions>

                <v-spacer></v-spacer>

                <v-btn @click="accountMetadata"
                       :disabled="!account.username || indexUiState.isLoading"
                       class="no-uppercase"
                       color="primary"
                       variant="flat">
                    <i18n-t keypath="index.login.username.button.next"></i18n-t>
                </v-btn>

            </v-card-actions>

        </v-window-item>

        <!-- Password -->
        <v-window-item :key="1">

            <v-toolbar color="surface" density="comfortable">

                <template v-slot:prepend>
                    <v-btn @click="uiState.window = 0"
                           icon
                           variant="text">
                        <span class="material-symbols-rounded">arrow_back</span>
                    </v-btn>
                </template>

                <template v-slot:title>
                    <span class="unselectable">
                        <i18n-t keypath="index.login.password.title"></i18n-t>
                    </span>
                </template>

            </v-toolbar>

            <v-card-text>

                <v-card variant="tonal">

                    <v-list-item class="unselectable">

                        <template v-slot:title>
                            {{ account.nickname }}
                        </template>

                        <template v-slot:subtitle>
                            @{{ account.username }}
                        </template>

                        <template v-slot:prepend>

                            <v-avatar class="unselectable"
                                      size="48">

                                <v-img v-if="!uiState.password.defaultAvatar"
                                       @error="uiState.password.defaultAvatar = true"
                                       :src="`${axios.defaults.baseURL}account/${account.id}/avatar`"
                                       draggable="false">
                                </v-img>
                                <span v-else
                                      class="material-symbols-rounded text-black material-avatar">
                                    account_circle
                                </span>

                            </v-avatar>

                        </template>

                    </v-list-item>

                </v-card>

                <div class="my-2 unselectable">
                    <i18n-t keypath="index.login.password.text"></i18n-t>
                </div>

                <v-text-field v-model="account.password"
                              @keyup.enter="accountLogin"
                              :error="!!uiState.error.password"
                              :error-messages="uiState.error.password"
                              :type="uiState.password.visibility ? 'text' : 'password'"
                              hide-details="auto"
                              variant="outlined">

                    <template v-slot:label>
                        <i18n-t keypath="index.login.password.label"></i18n-t>
                    </template>

                    <template v-slot:append-inner>
                        <v-btn v-show="!!account.password"
                               @click="uiState.password.visibility = !uiState.password.visibility"
                               color="onSurface"
                               icon
                               variant="text">
                            <span class="material-symbols-rounded">
                                {{ uiState.password.visibility ? 'visibility_off' : 'visibility' }}
                            </span>
                        </v-btn>
                    </template>

                </v-text-field>

                <v-checkbox-btn v-model="account.oneTimeLogin">
                    <template v-slot:label>

                        <i18n-t keypath="index.login.password.one-time.label"></i18n-t>

                        <v-tooltip location="bottom">

                            <template v-slot:activator="{props}">
                                <a v-bind="props" class="text-center ms-1 my-auto material-icon">
                                    <span class="material-symbols-rounded">info</span>
                                </a>
                            </template>

                            <i18n-t keypath="index.login.password.one-time.tooltip"></i18n-t>

                        </v-tooltip>

                    </template>
                </v-checkbox-btn>

                <v-expand-transition>

                    <div v-show="account.oneTimeLogin"
                         class="mt-2 unselectable">

                        <i18n-t keypath="index.login.password.duration.title"></i18n-t>

                        <v-expansion-panels class="mt-1">

                            <v-expansion-panel>

                                <template v-slot:title>
                                    <i18n-t keypath="index.login.password.duration.unit"
                                            :plural="durationList[account.duration]">
                                        <!--suppress VueUnrecognizedSlot -->
                                        <template v-slot:number>{{ durationList[account.duration] }}</template>
                                    </i18n-t>
                                </template>

                                <v-expansion-panel-text>

                                    <v-chip-group v-model="account.duration"
                                                  mandatory>

                                        <v-chip v-for="(duration, index) in durationList"
                                                :key="duration"
                                                class="unselectable">

                                            <template v-slot:prepend>
                                                <v-expand-x-transition>
                                                    <span v-if="account.duration == index"
                                                          class="material-symbols-rounded">
                                                        check
                                                    </span>
                                                </v-expand-x-transition>
                                            </template>

                                            <i18n-t keypath="index.login.password.duration.unit"
                                                    :plural="durationList[index]">
                                                <!--suppress VueUnrecognizedSlot -->
                                                <template v-slot:number>{{ durationList[index] }}</template>
                                            </i18n-t>

                                        </v-chip>

                                    </v-chip-group>

                                </v-expansion-panel-text>

                            </v-expansion-panel>

                        </v-expansion-panels>

                    </div>

                </v-expand-transition>

            </v-card-text>

            <v-card-actions>

                <v-spacer></v-spacer>

                <v-btn @click="accountLogin"
                       :disabled="!account.password || indexUiState.isLoading"
                       class="no-uppercase"
                       color="primary"
                       variant="flat">
                    <i18n-t keypath="index.login.password.button.login"></i18n-t>
                </v-btn>

            </v-card-actions>

        </v-window-item>

    </v-window>

</template>

<style scoped>
</style>