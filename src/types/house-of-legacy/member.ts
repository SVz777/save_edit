import { useGameStore } from "@/store/gameStore";
import { Type, TypeKey, MemberIndex, getVar, setVar } from "./vars"

export interface Member {
    idx: number;
    name: string;
    gender: number | string;
    generation?: string;
    rank?: string;
    reputation: number | string;
    stamina: number | string;
    age: number | string;
    health: number | string;
    mood: number | string;
    charm: number | string;
    lucky: number | string;
    talent: string;
    talentValue: number | string;
    skill: string;
    skillValue: number | string;
    wen: number | string;
    wu: number | string;
    shang: number | string;
    yi: number | string;
    mou: number | string;
    payment?: number | string;
}


export function getMembers(type: Type): Member[] {
    const { data } = useGameStore();
    if (!data) {
        return []
    }
    let familys = data.value[TypeKey[type]]['value'];
    if (!familys) {
        return []
    }
    let index = MemberIndex[type];
    console.log(familys)
    return familys.map((item: any, idx: number) => {
        let info: Member = {
            idx: idx,
            name: getVar(item, ...index.name),
            gender: getVar(item, ...index.gender ?? ''),
            generation: getVar(item, ...index.generation ?? ''),
            rank: getVar(item, ...index.rank ?? ''),
            reputation: getVar(item, ...index.reputation),
            stamina: getVar(item, ...index.stamina),
            age: getVar(item, ...index.age),
            health: getVar(item, ...index.health),
            mood: getVar(item, ...index.mood),
            charm: getVar(item, ...index.charm),
            lucky: getVar(item, ...index.lucky),
            talent: getVar(item, ...index.talent),
            talentValue: getVar(item, ...index.talentValue),
            skill: getVar(item, ...index.skill),
            skillValue: getVar(item, ...index.skillValue),
            wen: getVar(item, ...index.wen),
            wu: getVar(item, ...index.wu),
            shang: getVar(item, ...index.shang),
            yi: getVar(item, ...index.yi),
            mou: getVar(item, ...index.mou),
            payment: getVar(item, ...index.payment ?? '')
        }
        return info as Member;
    })
}

export function setMember(type: Type, idx: number, member: Member) {
    if (type == Type.Family) {
        setFamily(idx, member)
        return;
    }
}

function setFamily(idx: number, family: Member) {
    const { data } = useGameStore();
    if (!data) {
        return []
    }
    console.log(data, idx, family)
    let familys = data.value[TypeKey[Type.Family]]['value'];
    if (!familys) {
        return [];
    }
    // 遍历 MemberIndex 写入结果
    for (let key in MemberIndex[Type.Family]) {
        let path = MemberIndex[Type.Family][key];
        // 为了解决类型错误，我们需要确保 key 是 Member 接口的有效属性名。
        // 可以通过将 key 的类型限制为 keyof Member 来实现。
        const typedKey = key as keyof Member;
        setVar(familys[idx], family[typedKey], ...path)
    }
}