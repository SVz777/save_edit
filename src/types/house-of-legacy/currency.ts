import { useGameStore } from '@/store/gameStore'


const currencyKey = 'CGNum'
export const CurrencyType = {
    Money: '0',
    YuanBao: '1',
}

export type CurrencyType = (typeof CurrencyType)[keyof typeof CurrencyType]

export const CurrencyTypeName: Record<CurrencyType, string> = {
    [CurrencyType.Money]: '铜钱',
    [CurrencyType.YuanBao]: '元宝',
}

export const CurrencyIndex: Record<CurrencyType, number> = {
    [CurrencyType.Money]: 0,
    [CurrencyType.YuanBao]: 1,
}

export function getCurrency(type: CurrencyType): number {
    const { game } = useGameStore()
    if (!game.parsed) {
        return 0
    }
    let index = CurrencyIndex[type]
    return game.get(currencyKey, 'value', index)
}

export function updateCurrency(type: CurrencyType, value: number) {
    const { game } = useGameStore()
    if (!game.parsed) {
        return ''
    }
    let index = CurrencyIndex[type]
    if(type === CurrencyType.YuanBao && value > 100000000) {
        value = 100000000 // 最大值为 100000000
    }
    return game.set(value, currencyKey, 'value', index)
}