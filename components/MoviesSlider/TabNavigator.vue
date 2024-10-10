<template>
    <div class="rounded-md bg-neutral-300/50 p-1">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="{
                'bg-white': activeIndex === tab.id - 1,
            }"
            @click="
                setActiveIndex(tab.id);
                setNewKeyword(tab.name, tabType);
            "
            class="rounded px-4 py-1 capitalize transition-all duration-200"
        >
            {{ tab.name }}
        </button>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';

const tabType = ref('');

const emit = defineEmits(['keyword-selected']);
const props = defineProps({
    movieKeyword: {
        type: Object,
        required: true,
    },
});

const activeIndex = ref(0);
const tabs = [
    {
        id: 1,
        name: 'popular',
    },
    {
        id: 2,
        name: 'top rated',
    },
];

const setNewKeyword = (key, type) => {
    emit('keyword-selected', key, type);
};

const setActiveIndex = (id) => {
    activeIndex.value = id - 1;
};

onMounted(() => {
    tabType.value = props.movieKeyword.type;
});
</script>
