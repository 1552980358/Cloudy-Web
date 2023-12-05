<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
import {text} from 'stream/consumers'

const {t} = useI18n()

const props = defineProps({
    secret: String, setupStep: Object
})
const emits = defineEmits(
    ['update:secret', 'update:setup-step']
)

const nickname = ref()
const username = ref()
const password = ref()
const passwordRepeat = ref()

const passwordVisibility = ref(false)

const passwordLengthRegex = /^[a-zA-Z\d]{8,16}/
const passwordFormatRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+/
const textFieldRules = {
    required: (text: string) => !!text || t('setup.config-owner.error.required'),
    passwordLength: (text: string) => {
        return passwordLengthRegex.test(text) || t('setup.config-owner.error.password-length')
    },
    passwordFormat: (text: string) => {
        return passwordFormatRegex.test(text) || t('setup.config-owner.error.password-format')
    },
    passwordRepeat: (text: string) => {
        return text == password.value || t('setup.config-owner.error.password-repeat-mismatch')
    }
}

const isLoading = ref(false)
const configOwner = () => {
    // TODO: To be implemented
}

</script>

<template>

    <v-card-text>

        <v-text-field :clearable="true"
                      :disabled="isLoading"
                      :label="t('setup.config-owner.nickname')"
                      :rules="[textFieldRules.required]"
                      hide-details="auto"
                      type="text"
                      v-model="nickname">

            <template v-slot:prepend-inner>
                <span class="material-symbols-outlined">chat_bubble</span>
            </template>

        </v-text-field>

        <v-text-field :clearable="true"
                      :disabled="isLoading"
                      :label="t('setup.config-owner.username')"
                      :rules="[textFieldRules.required]"
                      class="mt-2"
                      hide-details="auto"
                      type="text"
                      v-model="username">

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">person</span>
            </template>

        </v-text-field>

        <v-text-field :clearable="true"
                      :disabled="isLoading"
                      :label="t('setup.config-owner.password')"
                      :rules="[textFieldRules.required, textFieldRules.passwordLength, textFieldRules.passwordFormat]"
                      :type="passwordVisibility ? 'text' : 'password'"
                      class="mt-2"
                      counter
                      hide-details="auto"
                      maxlength="16"
                      v-model="password">

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">lock</span>
            </template>

            <template v-slot:append>
                <v-btn @click="passwordVisibility = !passwordVisibility"
                       :rules="[textFieldRules.required, ]"
                       icon
                       variant="text"
                       v-model="passwordRepeat">

                    <span class="material-symbols-rounded">
                        {{ passwordVisibility ? 'visibility_off' : 'visibility' }}
                    </span>

                </v-btn>
            </template>

        </v-text-field>

        <v-text-field :clearable="true"
                      :disabled="isLoading"
                      :label="t('setup.config-owner.password-repeat')"
                      :rules="[textFieldRules.required, textFieldRules.passwordRepeat]"
                      class="mt-1"
                      hide-details="auto"
                      type="password">

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">lock</span>
            </template>

        </v-text-field>

    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="configOwner"
               :disabled="isLoading"
               color="primary"
               variant="flat">

            <template v-slot:prepend>
                <span class="material-symbols-rounded">check</span>
            </template>

            {{ t('setup.config-owner.proceed') }}

        </v-btn>

    </v-card-actions>

</template>

<style scoped>

</style>