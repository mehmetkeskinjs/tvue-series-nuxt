<template>
    <NuxtLink :to="link" class="font-medium text-white">
        {{ text }}
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    link: String,
    text: String,
    hasSublist: Boolean,
});
</script>
