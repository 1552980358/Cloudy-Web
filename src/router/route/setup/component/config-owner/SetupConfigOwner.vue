<script setup lang="ts">

import {computed, reactive, ref, watchEffect} from 'vue'
import {useI18n} from 'vue-i18n'
import {text} from 'stream/consumers'
import axios from 'axios'
import {Cropper, CircleStencil, Preview} from 'vue-advanced-cropper'
import SetupStep from '@/router/route/setup/setup-step'

const {t} = useI18n()

defineProps({
    secret: String, setupStep: Object
})
const emits = defineEmits(
    ['update:secret', 'update:setup-step']
)

const uiState = reactive({
    isLoading: false,

    /** Exceptions **/
    exceptionForbidden: false,
    exceptionServerInternalError: false,
})

const fields = reactive({
    nickname: null,
    username: null,
    password: null,
    passwordRepeat: null,
})

const passwordVisibility = ref(false)

const passwordLengthRegex = /^[a-zA-Z\d.!@#$%&*-_]{8,16}/
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
        return text == fields.password || t('setup.config-owner.error.password-repeat-mismatch')
    }
}

const avatarInput = ref()
const avatar = reactive({
    file: null,
    image: null,
})

const cropAvatarDialog = reactive({
    enable: false,
    preview: {
        coordinates: null,
        image: null,
    }
})

const onImageSelect = (event: { target: { files: File[] } }) => {
    let file = URL.createObjectURL(event.target.files[0])
    avatarInput.value.value = null;
    avatar.file = file
    cropAvatarDialog.enable = true
}
const onCropPreviewChange = ({coordinates, image}) => {
    cropAvatarDialog.preview = {
        image: image,
        coordinates: coordinates,
    }
}
const avatarCropper = ref()
const cropAvatar = () => {
    const { canvas } = avatarCropper.value.getResult()
    avatar.image = canvas.toDataURL()
    avatar.file = null
    cropAvatarDialog.enable = false
}
const validFields = computed(() => {
    const password = fields.password
    return !!fields.username
        && !!password
        && passwordLengthRegex.test(password)
        && passwordFormatRegex.test(password)
        && (password == fields.passwordRepeat)
        && !!fields.nickname
})
const configOwner = (secret: string) => {
    if (validFields.value && !uiState.isLoading) {
        uiState.isLoading = true
        let post_body = {
            username: fields.username,
            password: fields.password,
            nickname: fields.nickname,
            avatar: avatar.image,
            role: 'owner'
        }
        axios.post(`setup/owner?secret=${secret}`, post_body)
            .then(() => {
                emits('update:setup-step', SetupStep.Owner)
            })
            .catch((error) => {
                switch (error.response.status) {
                    case 401: {
                        // Unauthorized
                        emits('update:setup-step', SetupStep.Secret)
                        break
                    }
                    case 403: {
                        // Forbidden
                        uiState.exceptionForbidden = true
                        watchEffect(() => {
                            if (!uiState.exceptionForbidden) {
                                emits('update:setup-step', SetupStep.Owner)
                            }
                        })
                        break
                    }
                    case 500: {
                        // Internal Server Error
                        uiState.exceptionServerInternalError = true
                        uiState.isLoading = false
                        break
                    }
                }
            })
    }
}

</script>

<template>

    <v-snackbar v-model="uiState.exceptionForbidden"
                color="error-container">

        <span class="text-error">
            {{ t('setup.config-owner.exception.forbidden') }}
        </span>

    </v-snackbar>

    <v-snackbar v-model="uiState.exceptionServerInternalError"
                color="error-container">

        <span class="text-error">
            {{ t('setup.config-owner.exception.internal-server-error.message') }}
        </span>

        <template v-slot:actions>

            <v-btn @click="configOwner(secret)" color="on-error-container">
                {{ t('setup.config-owner.exception.internal-server-error.retry') }}
            </v-btn>

        </template>

    </v-snackbar>

    <v-card-text>

        <v-card variant="tonal">

            <v-card-title>

                <input @change="onImageSelect($event)"
                       accept="image/jpeg, image/png"
                       class="d-none"
                       ref="avatarInput"
                       type="file">

                <v-avatar class="setup-config-owner-avatar position-relative"
                          size="84">

                    <img v-if="!!avatar.image"
                         :src="avatar.image"
                         alt=""
                         class="w-100 h-100">
                    <span v-else
                          class="material-symbols-rounded text-black w-100 h-100">
                        account_circle
                    </span>

                </v-avatar>

            </v-card-title>

            <v-card-actions class="d-flex justify-center">

                <v-btn @click="avatarInput.click()" icon size="small" variant="flat">

                    <span class="material-symbols-rounded">upload</span>

                    <v-dialog v-model="cropAvatarDialog.enable"
                              width="720">

                        <v-card>

                            <v-card-title>
                                {{ t('setup.config-owner.avatar.title') }}
                            </v-card-title>

                            <v-card-text>

                                <cropper @change="onCropPreviewChange"
                                         :debounce="false"
                                         :src="avatar.file"
                                         :stencil-component="CircleStencil"
                                         class="w-100 h-auto"
                                         ref="avatarCropper">
                                </cropper>

                                <div class="mt-2 d-flex">

                                    <preview :width="120"
                                             :height="120"
                                             :image="cropAvatarDialog.preview.image"
                                             :coordinates="cropAvatarDialog.preview.coordinates">
                                    </preview>

                                    <v-avatar class="ms-2" size="120">

                                        <preview :image="cropAvatarDialog.preview.image"
                                                 :coordinates="cropAvatarDialog.preview.coordinates"
                                                 :height="120"
                                                 :width="120">
                                        </preview>

                                    </v-avatar>

                                    <v-avatar class="ms-2" size="96">

                                        <preview :image="cropAvatarDialog.preview.image"
                                                 :coordinates="cropAvatarDialog.preview.coordinates"
                                                 :height="96"
                                                 :width="96">
                                        </preview>

                                    </v-avatar>

                                    <v-avatar class="ms-2" size="72">

                                        <preview :image="cropAvatarDialog.preview.image"
                                                 :coordinates="cropAvatarDialog.preview.coordinates"
                                                 :height="72"
                                                 :width="72">
                                        </preview>

                                    </v-avatar>

                                </div>

                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>

                                <v-spacer></v-spacer>

                                <v-btn @click="cropAvatarDialog.enable = false">
                                    {{ t('setup.config-owner.avatar.action.cancel') }}
                                </v-btn>

                                <v-btn @click="cropAvatar"
                                       color="primary"
                                       variant="flat">
                                    {{ t('setup.config-owner.avatar.action.crop') }}
                                </v-btn>

                            </v-card-actions>

                        </v-card>

                    </v-dialog>

                </v-btn>

                <v-btn v-if="!!avatar.image" icon size="small" variant="flat">
                    <span class="material-symbols-rounded">delete</span>
                </v-btn>

            </v-card-actions>

        </v-card>

        <v-text-field :clearable="true"
                      :disabled="uiState.isLoading"
                      :label="t('setup.config-owner.nickname')"
                      :rules="[textFieldRules.required]"
                      class="mt-2"
                      hide-details="auto"
                      type="text"
                      v-model="fields.nickname">

            <template v-slot:prepend-inner>
                <span class="material-symbols-outlined">chat_bubble</span>
            </template>

        </v-text-field>

        <v-text-field :clearable="true"
                      :disabled="uiState.isLoading"
                      :label="t('setup.config-owner.username')"
                      :rules="[textFieldRules.required]"
                      v-model="fields.username"
                      class="mt-2"
                      hide-details="auto"
                      type="text">

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">person</span>
            </template>

        </v-text-field>

        <v-text-field :clearable="true"
                      :disabled="uiState.isLoading"
                      :label="t('setup.config-owner.password')"
                      :rules="[textFieldRules.required, textFieldRules.passwordLength, textFieldRules.passwordFormat]"
                      :type="passwordVisibility ? 'text' : 'password'"
                      v-model="fields.password"
                      class="mt-2"
                      hide-details="auto">

            <template v-slot:prepend-inner>
                <span class="material-symbols-rounded">lock</span>
            </template>

            <template v-slot:append>
                <v-btn @click="passwordVisibility = !passwordVisibility"
                       :rules="[textFieldRules.required, ]"
                       icon
                       variant="text">

                    <span class="material-symbols-rounded">
                        {{ passwordVisibility ? 'visibility_off' : 'visibility' }}
                    </span>

                </v-btn>
            </template>

        </v-text-field>

        <v-text-field :clearable="true"
                      :disabled="uiState.isLoading"
                      :label="t('setup.config-owner.password-repeat')"
                      :rules="[textFieldRules.required, textFieldRules.passwordRepeat]"
                      v-model="fields.passwordRepeat"
                      class="mt-2"
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

        <v-btn @click="configOwner(secret)"
               :disabled="!validFields || uiState.isLoading"
               :loading="uiState.isLoading"
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

.setup-config-owner-avatar {
    left: 50%;
    transform: translateX(-50%);
}

.setup-config-owner-avatar span {
    font-size: 84px;
}

</style>