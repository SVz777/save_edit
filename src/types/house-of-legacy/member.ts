import { useGameStore } from '@/store/gameStore'
import { Type, MemberIndex, getVar, setVar } from './vars'

export interface Member {
    id: string
    type: Type
    name: string
    gender: string
    generation?: string
    rank?: string
    reputation: string
    stamina: string
    age: string
    health: string
    mood: string
    charm: string
    lucky: string
    talent: string
    talentValue: string
    skill: string
    skillValue: string
    wen: string
    wu: string
    shang: string
    yi: string
    mou: string
    payment?: string
}

export function getMembers(type: Type): Member[] {
    const { data } = useGameStore()
    if (!data) {
        return []
    }
    let members = data.value[type]['value']
    if (!members) {
        return []
    }
    let index = MemberIndex[type]
    console.log(type, members)
    let ret = members.map((item: any) => {
        let info: Member = {
            id: getVar(item, ...index.id),
            type: type,
            name: getVar(item, ...index.name),
            gender: getVar(item, ...(index.gender ?? '')),
            generation: getVar(item, ...(index.generation ?? '')),
            rank: getVar(item, ...(index.rank ?? '')),
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
            payment: getVar(item, ...(index.payment ?? ''))
        }
        return info as Member
    })
    console.table(ret)
    return ret
}

export function updateMember(member: Member) {
    const { data } = useGameStore()
    if (!data) {
        return []
    }
    console.log('update member', member)
    let members = data.value[member.type]['value']
    if (!members) {
        return []
    }
    let origin = members.find((m: any) => m[0] === member.id)
    for (let key in MemberIndex[member.type]) {
        let path = MemberIndex[member.type][key]
        // 为了解决类型错误，我们需要确保 key 是 Member 接口的有效属性名。
        // 可以通过将 key 的类型限制为 keyof Member 来实现。
        const typedKey = key as keyof Member
        setVar(origin, member[typedKey], ...path)
    }
}
