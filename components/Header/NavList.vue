<template>
    <div class="flex items-center justify-center gap-6">
        <NavLink
            v-for="link in navLinks"
            :text="link.linkText"
            :link="link.linkUrl"
            :has-sublist="link.hasSublist"
            :sub-list="link.sublist"
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
                name: 'Popular',
                url: '/movies/popular',
            },
            {
                name: 'Now Playing',
                url: '/movies/now-playing',
            },
            {
                name: 'Upcoming',
                url: '/movies/upcoming',
            },{
                name: 'Top Rated',
                url: '/movies/top-rated',
            }
        ],
    },
    {
        linkText: 'Tv Shows',
        linkUrl: '/tv-shows',
        hasSublist: true,
        sublist: [
            {
                name: 'Popular',
                url: '/tv-shows/popular',
            },
            {
                name: 'Airing Today',
                url: '/tv-shows/airing-today',
            },
            {
                name: 'On TV',
                url: '/tv-shows/on-the-air',
            },{
                name: 'Top Rated',
                url: '/tv-shows/top-rated',
            }
        ],
    },
];
</script>
