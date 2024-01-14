<script setup lang="ts">

import {computed, PropType} from 'vue'

type Size = number | 'icon' | 'avatar' | 'avatar-large'
type Variant = 'filled' | 'outlined' | 'rounded'
type Easing = boolean | string | number

const props = defineProps({
    icon: String,
    size: {
        type: [Number, String] as PropType<Size>,
        default: 24
    },
    variant: {
        type: String as PropType<Variant>,
        default: 'rounded'
    },
    easing: {
        type: [Boolean, String, Number] as PropType<Easing>,
        default: false
    }
})

const fontSize = computed(() => {
    const size = getIconSize(props.size)
    return `${size}px`
})

const fontEasing = computed(() => {
    const duration = easingTransitionDuration(props.easing)
    return `font-size ${duration} ease`
})

const easingTransitionDuration = (easing: boolean | string | number) => {
    switch (typeof easing) {
        case 'number': {
            const unit = (easing > 1) ? 'ms' : 's'
            return easing + unit
        }
        case 'string': {
            if (easing.endsWith('ms') || easing.endsWith('m')) {
                return easing
            }
            return easingTransitionDuration(Number(easing))
        }
        default: {
            return easing ? '200ms' : '0'
        }
    }
}

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

    <span :class="`material-symbols-${props.variant}`">
        <slot>{{ props.icon }}</slot>
    </span>

</template>

<style scoped>

span {
    font-size: v-bind(fontSize);
    transition: v-bind(fontEasing);
}

</style>