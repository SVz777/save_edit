<script setup lang="ts">
    import { ref, computed } from 'vue'

    interface CardInfo {
        img: string
        title: string
        path: string
    }
    const cards = ref<Array<CardInfo>>([
        {
            img: 'https://makemaze.online/images/1750002850230_vrt5yhyp.png',
            title: '吾今有世家',
            path: '/house-of-legacy'
        }
    ])
</script>

<template>
    <h1 class="title">存档修改器</h1>
    <div class="container">
        <template
            v-for="(card, index) in cards"
            :key="index"
        >
            <Card class="card">
                <template #header>
                    <router-link :to="card.path">
                        <img
                            style="height: 100%; width: 100%"
                            alt="logo"
                            :src="card.img"
                        />
                    </router-link>
                </template>
                <template #title>
                    {{ card.title }}
                </template>
            </Card>
        </template>
    </div>
</template>

<style scoped>
    .container {
        margin: 0 auto;
        padding: 6rem;
        width: 80%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
        gap: 4rem;
    }

    .title {
        text-align: center;
        font-size: 2.5em;
        margin-bottom: 1em;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        color: transparent;
        background-clip: text;
        background-image: linear-gradient(to right, #3182ce, #805ad5);
    }

    .card {
        cursor: pointer;
        width: 30rem;
        height: 28rem;
        overflow: hidden;
    }

    .card:hover {
        transform: scale(1.02);
        transition: transform 0.3s ease;
    }

    @font-face {
        font-family: 'ChineseFont';
        src: local('宋体');
        unicode-range: U+4E00-9FFF;
        /* 中文字符范围 */
    }

    @font-face {
        font-family: 'EnglishFont';
        src: local('Helvetica');
        unicode-range: U+0000-007F;
        /* ASCII 字符范围 */
    }
</style>
