<template>
    <div class="flex items-center justify-center gap-6">
        <NavLink
            v-for="link in navLinks"
            :text="link.linkText"
            :link="link.linkUrl"
        />
    </div>
</template>

<script setup>
import NavLink from './NavLink.vue';

const navLinks = [
    {
        linkText: 'Movies',
        linkUrl: '/movies',
        hasSublist: true,
        sublist: [
            {
                Popular: '#',
                'Now Playing': '#',
            },
        ],
    },
    {
        linkText: 'Tv Shows',
        linkUrl: '/tv-shows',
        hasSublist: false,
    },
];
</script>
