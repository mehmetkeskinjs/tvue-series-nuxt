<template>
    <div class="relative group cursor-pointer">
        <div class="flex items-center font-medium text-white">
            {{ text }}
            <svg
                v-if="hasSublist"
                class="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
        
        <div v-if="hasSublist" class="absolute hidden group-hover:flex flex-col top-full left-0 w-48 bg-white rounded-md shadow-lg py-1">
            <NuxtLink v-for="item in subList" :to="item.url" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {{ item.name }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    link: String,
    text: String,
    hasSublist: Boolean,
    subList: Array
});
</script>
