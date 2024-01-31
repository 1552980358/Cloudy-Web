<script setup lang="ts">

import { computed, PropType } from 'vue';

type Size = 'icon' | 'avatar' | 'image';

const props = defineProps({
    icon: String,
    size: {
        type: String as PropType<Size>,
        default: 'icon'
    },
    fill: {
        type: Boolean,
        default: false,
    },
});

const convertIconSize = (size: string) => {
    switch (size) {
        case 'avatar':
            return '40';
        case 'image':
            return '56';
        case 'icon':
        default:
            return '24';
    }
}
const fontSize = computed(() => {
    const iconSize = convertIconSize(props.size);
    return `${iconSize}px`
});

const fill = computed(() => {
    return props.fill ? 1 : 0;
});

</script>

<template>
    <span class="material-symbols-rounded">
        <slot>{{ props.icon }}</slot>
    </span>
</template>

<style scoped>

span {
    font-size: v-bind(fontSize);
}

.material-symbols-rounded {
    font-variation-settings: 'FILL' v-bind(fill);
}

</style>