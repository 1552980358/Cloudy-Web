<script setup lang="ts">

import {inject, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import AccountCredential from '@/storage/account-credential'
import {IndexUiState} from '../../index-state'
import axios from 'axios'
import AxiosAuthorization from '@/axios/axios-authorization'
import {Account, AuthorizationState} from '@/util/global-state'
import AxiosRequest from '@/axios/axios-request'
import IndexLoginPanel from './index-login-panel'

const  {t} = useI18n()

const authorizationState = inject(AuthorizationState)
const account = inject(Account)

const indexUiState = inject(IndexUiState)

const uiState = reactive({
    panel: IndexLoginPanel.Username,
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
const fields = reactive({
    username: accountCredential.username,
    password: accountCredential.password,
    duration: {
        onetime: false,
        selection: 0,
    }
})

const durationList = [1, 3, 7, 15, 30, 180, 365]

const accountMetadata = reactive({
    id: null, nickname: null,
})

const requestAccountMetadata = () => {
    if (!indexUiState.isLoading && !!fields.username) {
        indexUiState.isLoading = true

        AxiosRequest.account.username.get(fields.username)
            .then((responseBody) => {
                accountMetadata.id = responseBody.id
                accountMetadata.nickname = responseBody.nickname
                uiState.error.username = null
                indexUiState.isLoading = false
                uiState.panel = IndexLoginPanel.Password
            })
            .catch((error) => {
                let errorKeyPath: string | null = null
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
    if (!indexUiState.isLoading && !!fields.password) {
        indexUiState.isLoading = true

        const duration = fields.duration.onetime ? durationList[fields.duration.selection] * 24 * 60 * 60 : null
        AxiosRequest.auth.post(fields.username, fields.password, duration)
            .then((token) => {
                AxiosAuthorization.setToken(token)
                account.id = accountMetadata.id
                account.username = fields.username
                account.nickname = accountMetadata.nickname
                if (fields.duration.onetime) {
                    accountCredential.token = token
                } else {
                    accountCredential.setCredential(token, fields.username, fields.password)
                }
                authorizationState.isAuthorized = true
                indexUiState.isLoading = false
                // TODO: Route to home
            })
            .catch((error) => {
                let errorKeyPath: string | null = null
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

    <v-window v-model="uiState.panel">

        <!-- Username -->
        <v-window-item :key="0">

            <v-card-title class="text-center unselectable">
                <i18n-t keypath="index.login.username.title"></i18n-t>
            </v-card-title>

            <v-card-text>

                <div class="unselectable">
                    <i18n-t keypath="index.login.username.text"></i18n-t>
                </div>

                <v-text-field v-model="fields.username"
                              @keyup.enter="requestAccountMetadata"
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

                <v-btn @click="requestAccountMetadata"
                       :disabled="!fields.username || indexUiState.isLoading"
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
                    <v-btn @click="uiState.panel = 0"
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
                            {{ accountMetadata.nickname }}
                        </template>

                        <template v-slot:subtitle>
                            @{{ fields.username }}
                        </template>

                        <template v-slot:prepend>

                            <v-avatar class="unselectable"
                                      size="48">

                                <v-img v-if="!uiState.password.defaultAvatar"
                                       @error="uiState.password.defaultAvatar = true"
                                       :src="`${axios.defaults.baseURL}account/${accountMetadata.id}/avatar`"
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

                <v-text-field v-model="fields.password"
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
                        <v-btn v-show="!!fields.password"
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

                <v-checkbox-btn v-model="fields.duration.onetime">
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

                    <div v-show="fields.duration.onetime"
                         class="mt-2 unselectable">

                        <i18n-t keypath="index.login.password.duration.title"></i18n-t>

                        <v-expansion-panels class="mt-1">

                            <v-expansion-panel>

                                <template v-slot:title>
                                    <i18n-t keypath="index.login.password.duration.unit"
                                            :plural="durationList[fields.duration]">
                                        <!--suppress VueUnrecognizedSlot -->
                                        <template v-slot:number>{{ durationList[fields.duration] }}</template>
                                    </i18n-t>
                                </template>

                                <v-expansion-panel-text>

                                    <v-chip-group v-model="fields.duration"
                                                  mandatory>

                                        <v-chip v-for="(duration, index) in durationList"
                                                :key="duration"
                                                class="unselectable">

                                            <template v-slot:prepend>
                                                <v-expand-x-transition>
                                                    <span v-if="fields.duration.selection == index"
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
                       :disabled="!fields.password || indexUiState.isLoading"
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