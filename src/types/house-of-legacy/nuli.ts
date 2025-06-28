import { useGameStore } from '@/store/gameStore'

const key = 'NuLiNum'

export function getNuLi(): number {
    const { game } = useGameStore()
    if (!game.parsed) {
        return 0
    }
    return game.get(key, 'value')
}

export function updateNuli(value: number) {
    const { game } = useGameStore()
    if (!game.parsed) {
        return ''
    }
    return game.set(Number(value), key, 'value')
}
