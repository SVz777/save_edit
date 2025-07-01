import { useGameStore } from '@/store/gameStore'
import { Towns } from './loc'

const key = 'Fengdi_now'

export interface Fief {
    id: string
    name: string
    unlocked: boolean
}

export function getFiefs(): Map<string, Fief> {
    const { game } = useGameStore()
    if (!game.parsed) {
        return new Map<string, Fief>()
    }
    const fiefs = game.get(key, 'value') as string[]
    const ret = new Map<string, Fief>()
    fiefs.forEach((fief: any, idx: number) => {
        if(idx == 0) {
            // 第一个不是
            return
        }
        const [unlocked] = fief as [string]
        ret.set(String(idx), { id: String(idx), name: Towns[String(idx-1) as keyof typeof Towns]??'', unlocked: unlocked == '1' })
    })
    return ret
}

export function updateFief(id: string, value: boolean) {
    const { game } = useGameStore()
    if (!game.parsed) {
        return ''
    }
    return game.set(value ? '1' : '0', key, 'value', id,0)
}
