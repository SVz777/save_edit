import { useGameStore } from '@/store/gameStore'
import * as _ from 'lodash'

// 定义常量对象
export const MemberType = {
    Family: 'Member_now',
    Spouse: 'Member_qu',
    Guest: 'MenKe_Now'
} as const

// 定义类型
export type MemberType = (typeof MemberType)[keyof typeof MemberType]

export const MemberTypeName: Record<MemberType, string> = {
    [MemberType.Family]: '家族成员',
    [MemberType.Spouse]: '嫁娶成员',
    [MemberType.Guest]: '门客成员'
}


export const MemberIndex: Record<MemberType, Record<string, any[]>> = {
    [MemberType.Family]: {
        // id
        id: [0],
        // info,
        info: [4],
        // 性格
        nature: [5],
        // 年龄
        age: [6],
        // 文
        wen: [7],
        // 武
        wu: [8],
        // 商
        shang: [9],
        // 艺
        yi: [10],
        // 心情
        mood: [11],
        // 爵位
        rank: [14],
        // 人物状态
        status: [15],
        // 声誉
        reputation: [16],
        // 魅力
        charm: [20],
        // 健康
        health: [21],
        // 怀孕
        pregnancy: [25],
        // 谋
        mou: [27],
        // 体力
        stamina: [30],
        // 技能值
        skillValue: [33]
    },
    [MemberType.Spouse]: {
        // id
        id: [0],
        // info
        info: [2],
        // 年龄
        age: [5],
        // 文
        wen: [6],
        // 武
        wu: [7],
        // 商
        shang: [8],
        // 艺
        yi: [9],
        // 心情
        mood: [10],
        // 声誉
        reputation: [12],
        // 魅力
        charm: [15],
        // 健康
        health: [16],
        // 怀孕
        pregnancy: [18],
        // 谋
        mou: [19],
        // 体力
        stamina: [20],
        // 技能值
        skillValue: [23]
    },
    [MemberType.Guest]: {
        // id
        id: [0],
        // info
        info: [2],
        // 年龄
        age: [3],
        // 文
        wen: [4],
        // 武
        wu: [5],
        // 商
        shang: [6],
        // 艺
        yi: [7],
        // 心情
        mood: [8],
        // 人物状态
        status: [10],
        // 声誉
        reputation: [11],
        // 魅力
        charm: [13],
        // 健康
        health: [14],
        // 谋
        mou: [15],
        // 技能值
        skillValue: [16],
        // 怀孕
        pregnancy: [17],
        // 薪水
        payment: [18],
        // 体力
        stamina: [19]
    }
}

const InfoIndex: Record<MemberType, Record<string, number>> = {
    [MemberType.Family]: {
        name: 0,
        generation: 1,
        talent: 2,
        talentValue: 3,
        gender: 4,
        life: 5,
        skill: 6,
        lucky: 7,
        like: 9
    },
    [MemberType.Spouse]: {
        name: 0,
        generation: 1,
        talent: 2,
        talentValue: 3,
        gender: 4,
        life: 5,
        skill: 6,
        lucky: 7,
        nature: 8,
        spouse: 9,
        like: 10,
        pregnantChildrenParent: 11
    },
    [MemberType.Guest]: {
        name: 0,
        generation: 1,
        talent: 2,
        talentValue: 3,
        gender: 4,
        life: 5,
        skill: 6,
        lucky: 7,
        nature: 8,
        pregnantChildrenParent: 9
    }
}

export interface Member {
    id: string
    info: string
    type: MemberType
    name?: string
    gender?: string
    generation?: string
    rank?: string
    reputation: string
    stamina: string
    age: string
    health: string
    mood: string
    charm: string
    nature: string
    lucky?: string
    talent?: string
    talentValue?: string
    skill?: string
    skillValue?: string
    wen: string
    wu: string
    shang: string
    yi: string
    mou: string
    pregnancy?: string
    status?: string
    payment?: string
    //
    pregnantChildrenParent?: string
}

export function getMembers(type: MemberType): Member[] {
    const { game } = useGameStore()
    if (!game) {
        return []
    }
    let members = game.get(type, 'value')
    if (!members) {
        return []
    }
    let index = MemberIndex[type]
    let ret = members.map((member: any) => {
        let info: Member = {
            id: _.get(member, index.id),
            type: type,
            info: _.get(member, index.info),
            rank: _.get(member, index.rank),
            reputation: _.get(member, index.reputation),
            stamina: _.get(member, index.stamina),
            age: _.get(member, index.age),
            health: _.get(member, index.health),
            mood: _.get(member, index.mood),
            charm: _.get(member, index.charm),
            nature: _.get(member, index.nature),
            skillValue: _.get(member, index.skillValue),
            wen: _.get(member, index.wen),
            wu: _.get(member, index.wu),
            shang: _.get(member, index.shang),
            yi: _.get(member, index.yi),
            mou: _.get(member, index.mou),
            payment: _.get(member, index.payment),
            pregnancy: _.get(member, index.pregnancy),
            status: _.get(member, index.status),
            ...getInfo(type, _.get(member, index.info)!)
        }
        return info
    })
    return ret
}

function getInfo(type: MemberType, infoS: string): {} {
    const index = InfoIndex[type]
    const info = infoS.split('|')
    const ret: { [key: string]: any } = {}
    for (let key in index) {
        let idx = index[key]
        ret[key] = info[idx]
    }
    return ret
}

function updateInfo(member: Member) {
    const index = InfoIndex[member.type]
    const infoS: string[] = member.info.split('|')
    for (let key in index) {
        let idx = index[key]
        infoS[idx] = member[key as keyof Member] ?? ''
    }

    member.info = infoS.join('|')
}

export function updateMember(member: Member) {
    const { game } = useGameStore()
    if (!game) {
        return []
    }
    let members = game.get(member.type, 'value')
    if (!members) {
        return []
    }
    let originMember = members.find((m: any) => m[0] === member.id)
    if (!originMember) {
        return
    }
    updateInfo(member)
    for (let key in MemberIndex[member.type]) {
        let path = MemberIndex[member.type][key]
        // 为了解决类型错误，我们需要确保 key 是 Member 接口的有效属性名。
        // 可以通过将 key 的类型限制为 keyof Member 来实现。
        const typedKey = key as keyof Member
        _.set(originMember, path, String(member[typedKey]))
    }
}
