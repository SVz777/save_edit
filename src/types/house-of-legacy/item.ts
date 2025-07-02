import { useGameStore } from '@/store/gameStore'
import { ItemType } from './consts';

const itemKey = 'Prop_have'

export const ItemTypeName: Record<ItemType, string> = {
    [ItemType.Incense]: '线香',
    [ItemType.Fertilizer]: '肥料',
    [ItemType.Food]: '粮食',
    [ItemType.Vegetables]: '蔬菜',
    [ItemType.Meat]: '肉食'
}

export function getItems(): { [key: ItemType]: number } {
    const { game } = useGameStore()
    if (!game.parsed) {
        return Object.values(ItemType).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {} as Record<ItemType, number>);
    }
    const items = game.get(itemKey, 'value')
    const ret = {} as Record<ItemType, number>
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
