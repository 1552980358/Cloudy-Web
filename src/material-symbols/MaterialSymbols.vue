<script setup lang="ts">

import {computed, PropType} from 'vue'

type Size = Number | 'icon' | 'avatar' | 'avatar-large'
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
    const size = getIconSize(props.size)
    return `${size}px`
})

const getIconSize = (size: string | Number) => {
    switch (size) {
        case 'icon': {
            return 24
        }
        case 'avatar': {
            return 40
        }
        case 'avatar-large': {
            return 48
        }
        default: {
            return size
        }
    }
}

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