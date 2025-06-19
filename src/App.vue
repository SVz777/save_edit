<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useGameStore } from '@/store/gameStore'

    let game = useGameStore()
    onMounted(() => {})
</script>

<template>
    <router-view />
</template>

<style scoped></style>
