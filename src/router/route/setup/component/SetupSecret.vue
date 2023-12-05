<script setup lang="ts">
import {computed, ref} from 'vue'
import axios, {AxiosResponse} from 'axios'
import {useI18n} from 'vue-i18n'
import SetupSecretResponse from '@/router/route/setup/component/setup-secret-response'
import SetupStep from '@/router/route/setup/setup-step'

const {t} = useI18n()

const props = defineProps({
    secret: String, setupStep: Object,
})
const emits = defineEmits([
    'update:secret', 'update:setup-step'
])

const secret = computed({
    get: () => props.secret,
    set: (val) => emits('update:secret', val)
})

const isLoading = ref(false)
const startVerifySecret = (secret: string) => {
    if (!!secret && !isLoading.value) {
        isLoading.value = true
        axios.get(`setup?secret=${secret}`)
            .then((axiosResponse: AxiosResponse) => axiosResponse.data as SetupSecretResponse)
            .then((setupSecretResponse: SetupSecretResponse) => {
                emits(
                    'update:setup-step',
                    setupSecretResponse.has_owner ? SetupStep.Owner : SetupStep.ConfigOwner
                )
            })
            .catch(() => {
                isLoading.value = false
            })
    }
}

</script>

<template>

    <v-card-text>

        <v-text-field :clearable="true"
                      :label="t('setup.secret.input')"
                      :disabled="isLoading"
                      hide-details="auto"
                      type="password"
                      v-model="secret">

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">lock</span>
            </template>

        </v-text-field>

    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="startVerifySecret(secret)"
               :disabled="isLoading"
               :loading="isLoading"
               color="primary"
               variant="flat">

            <template v-slot:prepend>
                <span class="material-symbols-rounded">check</span>
            </template>

            {{ t('setup.secret.done') }}
        </v-btn>

    </v-card-actions>

</template>

<style scoped>
</style>