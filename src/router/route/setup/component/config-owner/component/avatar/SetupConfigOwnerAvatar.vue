<script setup lang="ts">

import {computed, inject, onMounted, reactive, ref} from 'vue'
import ConfigOwnerState from '../../setup-config-owner-state'
import {CircleStencil, Cropper, Preview} from 'vue-advanced-cropper'
import SetupConfigOwnerPanel from '@/router/route/setup/component/config-owner/setup-config-owner-panel'
import MaterialSymbols from '@/material-symbols/MaterialSymbols.vue'

const configOwnerUiState = inject(ConfigOwnerState.uiState)
const fields = inject(ConfigOwnerState.fields)

const uiState = reactive({
    fileUrl: null as string | null,
    cropperPreview: {
        image: null,
        coordinates: null,
    },
})

const cropperDialog = computed({
    get: () => !!uiState.fileUrl,
    set: (value: boolean) => {
        if (!value) {
            uiState.fileUrl = null
        }
    },
})

const fileInput = ref()
onMounted(() => {
    const fileInputElement = fileInput.value
    fileInputElement.onchange = () => {
        const imageFilePath = fileInputElement.files[0]

        // Reset cropper preview
        uiState.cropperPreview.image = null
        uiState.cropperPreview.coordinates = null
        uiState.fileUrl = URL.createObjectURL(imageFilePath)

        fileInputElement.value = null
    }
})

const dialogCropper = ref()
const onCropperPreview = ({coordinates, image}) => {
    // Update coordinates
    uiState.cropperPreview.coordinates = coordinates
    // Update image metadata
    if (uiState.cropperPreview.image != image) {
        uiState.cropperPreview.image = image
    }
}
const onCropImageClick = () => {
    const {canvas} = dialogCropper.value.getResult()
    // Update to avatar field
    fields.avatar = canvas.toDataURL()
    // Close dialog
    uiState.fileUrl = null
}

const onNextClick = () => {
    configOwnerUiState.panel = SetupConfigOwnerPanel.upload
}

</script>

<template>

    <input accept="image/png, image/jpeg"
           class="d-none"
           ref="fileInput"
           type="file">

    <v-card-title class="unselectable">
        <i18n-t keypath="setup.config-owner.avatar.title"></i18n-t>
    </v-card-title>

    <v-card-text>

        <div class="text-center">
            <v-avatar class="avatar unselectable">
                <v-img :src="fields.avatar"
                       class="w-100 h-100"
                       draggable="false">
                    <template v-slot:placeholder>
                        <material-symbols>account_circle</material-symbols>
                    </template>
                </v-img>
            </v-avatar>
        </div>

        <div class="text-center mt-2">

            <v-btn @click="fileInput.click()"
                   variant="text">

                <template v-slot:prepend>
                    <material-symbols>upload</material-symbols>>
                </template>

                <i18n-t keypath="setup.config-owner.avatar.button.upload"></i18n-t>

            </v-btn>

            <v-expand-x-transition>
                <v-btn @click="fields.avatar = null"
                       v-if="!!fields.avatar"
                       class="ms-2"
                       variant="text">

                    <template v-slot:prepend>
                        <material-symbols>close</material-symbols>
                    </template>

                    <i18n-t keypath="setup.config-owner.avatar.button.reset"></i18n-t>

                </v-btn>
            </v-expand-x-transition>

            <v-dialog v-model="cropperDialog"
                      max-width="720"
                      width="75%">
                <v-card class="w-100 h-auto">

                    <v-card-title class="unselectable">
                        <i18n-t keypath="setup.config-owner.avatar.dialog.title"></i18n-t>
                    </v-card-title>

                    <v-card-text>

                        <cropper @change="onCropperPreview"
                                 :debounce="false"
                                 :src="uiState.fileUrl"
                                 :stencil-component="CircleStencil"
                                 class="w-100 h-auto"
                                 ref="dialogCropper">
                        </cropper>

                        <div class="mt-2 d-flex">

                            <preview :coordinates="uiState.cropperPreview.coordinates"
                                     :image="uiState.cropperPreview.image"
                                     :height="120"
                                     :width="120">
                            </preview>

                            <v-avatar class="ms-2" size="120">
                                <preview :coordinates="uiState.cropperPreview.coordinates"
                                         :image="uiState.cropperPreview.image"
                                         :height="120"
                                         :width="120">
                                </preview>
                            </v-avatar>

                            <v-avatar class="ms-2" size="84">
                                <preview :coordinates="uiState.cropperPreview.coordinates"
                                         :image="uiState.cropperPreview.image"
                                         :height="84"
                                         :width="84">
                                </preview>
                            </v-avatar>

                            <v-avatar class="ms-2" size="48">
                                <preview :coordinates="uiState.cropperPreview.coordinates"
                                         :image="uiState.cropperPreview.image"
                                         :height="48"
                                         :width="48">
                                </preview>
                            </v-avatar>

                        </div>

                    </v-card-text>

                    <v-card-actions>

                        <v-spacer></v-spacer>

                        <v-btn @click="uiState.fileUrl = null">
                            <i18n-t keypath="setup.config-owner.avatar.dialog.button.cancel"></i18n-t>
                        </v-btn>

                        <v-btn @click="onCropImageClick">
                            <i18n-t keypath="setup.config-owner.avatar.dialog.button.proceed"></i18n-t>
                        </v-btn>

                    </v-card-actions>

                </v-card>
            </v-dialog>

        </div>

    </v-card-text>

    <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn @click="onNextClick"
               variant="elevated">
            <i18n-t keypath="setup.config-owner.avatar.button.next"></i18n-t>
        </v-btn>

    </v-card-actions>

</template>

<style scoped>

.avatar {
    width: 88px;
    height: 88px;
}

.avatar span {
    font-size: 88px;
}

</style>