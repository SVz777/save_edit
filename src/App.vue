<script setup lang="ts">
    import { useGameStore } from '@/store/gameStore'

    let { game } = useGameStore()
    window.game = game
</script>

<template>
    <Toast />
    <router-view />
</template>

<style scoped></style>
