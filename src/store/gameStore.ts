import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useGameStore = defineStore('house-of-legacy', () => {
    const data = ref<Record<string, any>>({})
    return {
        data
    }
})
