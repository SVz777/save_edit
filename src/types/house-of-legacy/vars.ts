export const MemberTalent: Record<number, string> = {
    0: "无",
    1: "文",
    2: "武",
    3: "商",
    4: "艺"
}

export const MemberSkill: Record<number, string> = {
    0: "无",
    1: "巫",
    2: "医",
    3: "相",
    4: "卜",
    5: "魅",
    6: "工"
}

export enum Type {
    Family,
    Spouse,
    Guest,
}

export const TypeKey: Record<Type, string> = {
    [Type.Family]: "Member_now",
    [Type.Spouse]: "Member_qu",
    [Type.Guest]: "MenKe_Now",
}

export const MemberIndex: Record<Type, Record<string, any[]>> = {
    [Type.Family]: {
        // 名字
        name: [4, "|", 0],
        // 性别
        gender: [4, "|", 4],
        // 第几代
        generation: [4, "|", 1],
        // 爵位
        rank: [14],
        // 声誉
        reputation: [16],
        // 体力
        stamina: [30],
        // 年龄
        age: [6],
        // 健康
        health: [21],
        // 心情
        mood: [11],
        // 魅力
        charm: [20],
        // 幸运
        lucky: [7],
        // 天赋
        talent: [4, "|", 2],
        // 天赋值
        talentValue: [4, "|", 3],
        // 技能
        skill: [4, "|", 6],
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
        // 名字
        name: [2, "|", 0],
        // 性别
        gender: [4, "|", 4],
        // 声誉
        reputation: [12],
        // 体力
        stamina: [30],
        // 年龄
        age: [5],
        // 健康
        health: [16],
        // 心情
        mood: [11],
        // 魅力
        charm: [20],
        // 幸运
        lucky: [7],
        // 天赋
        talent: [4, "|", 2],
        // 天赋值
        talentValue: [4, "|", 3],
        // 技能
        skill: [4, "|", 6],
        // 技能值
        skillValue: [33],
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
        pregnancy: [18],
    },
    [Type.Guest]: {
        // 名字
        name: [2, "|", 0],
        // 声誉
        reputation: [11],
        // 体力
        stamina: [30],
        // 年龄
        age: [3],
        // 健康
        health: [21],
        // 心情
        mood: [11],
        // 魅力
        charm: [20],
        // 幸运
        lucky: [7],
        // 天赋
        talent: [4, "|", 2],
        // 天赋值
        talentValue: [4, "|", 3],
        // 技能
        skill: [4, "|", 6],
        // 技能值
        skillValue: [33],
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
        payment: [18],
    },
};

export function getVar(data: string[], ...path: any[]): string {
    if (path.length == 1) {
        return data[path[0]];
    }
    if (path.length == 3) {
        return data[path[0]].split(path[1])[path[2]];
    }
    return ""
}

export function setVar(data: string[], value: any, ...path: any[]) {
    if (path.length == 1) {
        data[path[0]] = value
    }
    if (path.length == 3) {
        let t = data[path[0]].split(path[1]);
        t[path[2]] = value;
        data[path[0]] = t.join(path[1])
    }
}