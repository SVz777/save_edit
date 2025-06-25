import { useGameStore } from '@/store/gameStore'


const moneyKey = 'CGNum'
export const MoneyType = {
    Money: '0',
    YuanBao: '1',
}

export type MoneyType = (typeof MoneyType)[keyof typeof MoneyType]

export const MoneyTypeName: Record<MoneyType, string> = {
    [MoneyType.Money]: '铜钱',
    [MoneyType.YuanBao]: '元宝',
}

export const MoneyIndex: Record<MoneyType, number> = {
    [MoneyType.Money]: 0,
    [MoneyType.YuanBao]: 1,
}

export function getMoney(type: MoneyType): string {
    const { game } = useGameStore()
    if (!game.parsed) {
        return ''
    }
    let index = MoneyIndex[type]
    return game.get(moneyKey, 'value', index)
}

export function updateMoney(type: MoneyType, value: string) {
    const { game } = useGameStore()
    if (!game.parsed) {
        return ''
    }
    let index = MoneyIndex[type]
    return game.set(value, moneyKey, 'value', index)
}