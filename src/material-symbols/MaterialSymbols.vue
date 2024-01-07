<script setup lang="ts">

import {computed, PropType} from 'vue'

type Size = Number | 'icon' | 'avatar'
type Variant = 'filled' | 'outlined' | 'rounded'

const props = defineProps({
    icon: String,
    size: {
        type: [Number, String] as PropType<Size>,
        default: 24
    },
    variant: {
        type: String as PropType<Variant>,
        default: 'rounded'
    }
})

const spanClass = computed(() => {
    return `material-symbols-${props.variant}`
})

const fontSize = computed(() => {
    const propSize = props.size
    const size = propSize == 'icon' ? 24 : propSize == 'avatar' ? 48 : propSize
    return `${size}px`
})

</script>

<template>

    <span :class="spanClass">
        <slot>{{ props.icon }}</slot>
    </span>

</template>

<style scoped>

span {
    font-size: v-bind(fontSize);
}

</style>