import { useGameStore } from '@/store/gameStore'

const key = 'FamilyData'
export const FamilyType = {
    SurName: '1',
    Level: '2',
    Exp: '3'
}

export type FamilyType = (typeof FamilyType)[keyof typeof FamilyType]

export const FamilyTypeName: Record<FamilyType, string> = {
    [FamilyType.SurName]: '姓氏',
    [FamilyType.Level]: '等级',
    [FamilyType.Exp]: '经验'
}

export const FamilyIndex: Record<FamilyType, number> = {
    [FamilyType.SurName]: 1,
    [FamilyType.Level]: 2,
    [FamilyType.Exp]: 3
}

export function getFamily(type: FamilyType): number {
    const { game } = useGameStore()
    if (!game.parsed) {
        return 0
    }
    let index = FamilyIndex[type]
    return game.get(key, 'value', index)
}

export function updateFamily(type: FamilyType, value: string) {
    const { game } = useGameStore()
    if (!game.parsed) {
        return ''
    }
    let index = FamilyIndex[type]
    return game.set(String(value), key, 'value', index)
}
