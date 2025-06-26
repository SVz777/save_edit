import { useGameStore } from '@/store/gameStore'

const itemKey = 'Prop_have'
export const ItemType = {
    Food: '2',
    Vegetables: '3',
    Meat: '4'
}

export type ItemType = (typeof ItemType)[keyof typeof ItemType]

export const ItemTypeName: Record<ItemType, string> = {
    [ItemType.Food]: '粮食',
    [ItemType.Vegetables]: '蔬菜',
    [ItemType.Meat]: '肉食'
}

export function getItems(): { [key: ItemType]: number } {
    const { game } = useGameStore()
    if (!game.parsed) {
        return {}
    }
    let items = game.get(itemKey, 'value')
    let ret: { [key: ItemType]: number } = {}
    for (const [_, value] of Object.entries(items)) {
        const [key, v] = value as Array<string>
        ret[key as ItemType] = Number(v)
    }
    return ret
}

export function setItem(type: ItemType, value: number) {
    const { game } = useGameStore()
    if (!game.parsed) {
        return
    }
    let items = game.get(itemKey, 'value')
    const item = items.find((item: any) => item[0] === type)
    if (item) {
        item[1] = String(value)
    }
}
