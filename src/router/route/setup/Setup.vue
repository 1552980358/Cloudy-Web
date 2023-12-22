<script setup lang="ts">

import {computed, ref} from 'vue'
import {useTheme} from 'vuetify'
import {DarkTheme, LightTheme} from '@/vuetify/vuetify'
import {useI18n} from 'vue-i18n'
import SetupStep from './setup-step'
import SetupSecret from './component/secret/SetupSecret.vue'
import SetupConfigOwner from './component/config-owner/SetupConfigOwner.vue'
import SetupOwner from './component/owner/SetupOwner.vue'

const {t} = useI18n()

const theme = useTheme()
const triggerTheme = () => {
    const global = theme.global
    global.name.value = global.current.value.dark ? LightTheme : DarkTheme
}

const setupStep = ref(SetupStep.Secret)
const windowStep = computed({
    get: () => setupStep.value.step,
    set: (newStep) => {
        for (const [, item] of Object.entries(SetupStep)) {
            if (item.step == newStep) {
                setupStep.value = item
                break
            }
        }
    }
})

const secret = ref()

</script>

<template>

    <v-app-bar color="primary">

        <v-btn icon>
            <span class="material-symbols-rounded">settings</span>
        </v-btn>

        <v-app-bar-title class="unselectable">
            {{ t('setup.title') }}
        </v-app-bar-title>

        <v-btn @click="triggerTheme"
               icon>
                <span class="material-symbols-rounded">
                    {{ theme.global.current.value.dark ? 'light_mode' : 'dark_mode' }}
                </span>
        </v-btn>

    </v-app-bar>

    <v-main>

        <v-container class="d-flex h-100">

            <v-card class="ma-auto w-50" max-width="600">

                <v-card-item class="unselectable">
                    <v-card-title>{{ t(`setup.${setupStep.name}.title`) }}</v-card-title>
                </v-card-item>

                <v-window v-model="windowStep">

                    <!-- Secret input -->
                    <v-window-item :key="SetupStep.Secret.step">

                        <setup-secret v-model:secret="secret"
                                      v-model:setup-step="setupStep">
                        </setup-secret>

                    </v-window-item>

                    <!-- Owner Configuration -->
                    <v-window-item :key="SetupStep.ConfigOwner.step">

                        <setup-config-owner v-model:secret="secret"
                                            v-model:setup-step="setupStep">
                        </setup-config-owner>

                    </v-window-item>

                    <v-window-item :key="SetupStep.Owner.step">

                        <setup-owner></setup-owner>

                    </v-window-item>

                </v-window>

            </v-card>

        </v-container>

    </v-main>

</template>

<style scoped>

</style>