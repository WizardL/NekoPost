<template>
    <li class="post-item">
        <p class="score">{{ item.score }}</p>
        <template v-if="item.url">
            <a :href="item.url" target="_blank">{{ item.title }}</a>
        </template>
        <template v-else>
            <router-link :to="/item/ + item.id">{{ item.title }}</router-link>
        </template>
    </li>
</template>
