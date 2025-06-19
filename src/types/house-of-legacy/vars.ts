// 定义常量对象
export const Type = {
    Family: 'Member_now',
    Spouse: 'Member_qu',
    Guest: 'MenKe_Now'
} as const

// 定义类型
export type Type = (typeof Type)[keyof typeof Type]

export const TypeName: Record<Type, string> = {
    [Type.Family]: '家族成员',
    [Type.Spouse]: '嫁娶成员',
    [Type.Guest]: '门客成员'
}

export const MemberTalentOptions = [
    { value: 0, label: '无' },
    { value: 1, label: '文' },
    { value: 2, label: '武' },
    { value: 3, label: '商' },
    { value: 4, label: '艺' }
]
export const MemberSkillOptions = [
    { value: 0, label: '无' },
    { value: 1, label: '巫' },
    { value: 2, label: '医' },
    { value: 3, label: '相' },
    { value: 4, label: '卜' },
    { value: 4, label: '魅' },
    { value: 4, label: '工' }
]

export const MemberIndex: Record<Type, Record<string, any[]>> = {
    [Type.Family]: {
        // id
        id: [0],
        // 名字
        name: [4, '|', 0],
        // 性别
        gender: [4, '|', 4],
        // 第几代
        generation: [4, '|', 1],
        // 爵位
        rank: [14],
        // 声誉
        reputation: [16],
        // 体力
        stamina: [30],
        // 年龄
        age: [6],
        // 寿命
        life: [4, '|', 5],
        // 健康
        health: [21],
        // 心情
        mood: [11],
        // 魅力
        charm: [20],
        // 幸运
        lucky: [4, '|', 7],
        // 喜好
        like: [4, '|', 9],
        // 性格
        nature: [5],
        // 天赋
        talent: [4, '|', 2],
        // 天赋值
        talentValue: [4, '|', 3],
        // 技能
        skill: [4, '|', 6],
        // 技能值
        skillValue: [33],
        // 文
        wen: [7],
        // 武
        wu: [8],
        // 商
        shang: [9],
        // 艺
        yi: [10],
        // 谋
        mou: [27],

        // 怀孕
        pregnancy: [25],
        // 惩罚状态
        punishmentStatus: [15]
    },
    [Type.Spouse]: {
        // id
        id: [0],
        // 名字
        name: [2, '|', 0],
        // 性别
        gender: [2, '|', 4],
        // 声誉
        reputation: [12],
        // 体力
        stamina: [20],
        // 年龄
        age: [5],
        // 健康
        health: [16],
        // 心情
        mood: [11],
        // 魅力
        charm: [15],
        // 幸运
        lucky: [2, '|', 7],
        // 天赋
        talent: [2, '|', 2],
        // 天赋值
        talentValue: [2, '|', 3],
        // 技能
        skill: [2, '|', 6],
        // 技能值
        skillValue: [23],
        // 文
        wen: [6],
        // 武
        wu: [7],
        // 商
        shang: [8],
        // 艺
        yi: [9],
        // 谋
        mou: [19],
        // 怀孕
        pregnancy: [18]
    },
    [Type.Guest]: {
        // id
        id: [0],
        // 名字
        name: [2, '|', 0],
        // 性别
        gender: [2, '|', 4],
        // 声誉
        reputation: [11],
        // 体力
        stamina: [19],
        // 年龄
        age: [3],
        // 健康
        health: [14],
        // 心情
        mood: [8],
        // 魅力
        charm: [13],
        // 幸运
        lucky: [2, '|', 7],
        // 天赋
        talent: [2, '|', 2],
        // 天赋值
        talentValue: [2, '|', 3],
        // 技能
        skill: [2, '|', 6],
        // 技能值
        skillValue: [16],
        // 文
        wen: [4],
        // 武
        wu: [5],
        // 商
        shang: [6],
        // 艺
        yi: [7],
        // 谋
        mou: [15],
        // 薪水
        payment: [18]
    }
}

export function getVar(data: string[], ...path: any[]): string {
    if (path.length == 1) {
        return data[path[0]]
    }
    if (path.length == 3) {
        return data[path[0]].split(path[1])[path[2]]
    }
    return ''
}

export function setVar(data: string[], value: any, ...path: any[]) {
    if (path.length == 1) {
        data[path[0]] = value
    }
    if (path.length == 3) {
        let t = data[path[0]].split(path[1])
        t[path[2]] = value
        data[path[0]] = t.join(path[1])
    }
}
