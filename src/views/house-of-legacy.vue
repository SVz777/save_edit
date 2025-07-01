<script setup lang="ts">
    import { useGameStore } from '@/store/gameStore'
    import {
        type Member,
        MemberType,
        MemberTypeName,
        getMembers,
        updateMember,
        MemberRankOptions,
        MemberTalentOptions,
        MemberSkillOptions,
        MemberStatusOptions,
        MemberNatureOptions
    } from '@/types/house-of-legacy/member'
    import {
        CurrencyType,
        CurrencyTypeName,
        getCurrency,
        updateCurrency
    } from '@/types/house-of-legacy/currency'
    import {
        FamilyType,
        FamilyTypeName,
        getFamily,
        updateFamily
    } from '@/types/house-of-legacy/family'
    import { getItems, ItemType, ItemTypeName, setItem } from '@/types/house-of-legacy/item'
    import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
    import { useToast } from 'primevue/usetoast'
    import { getNuLi, updateNuli } from '@/types/house-of-legacy/nuli'
    import { getFiefs, updateFief, type Fief } from '@/types/house-of-legacy/fief'
    const fileupload = ref()
    const { game } = useGameStore()
    const toast = useToast()
    const editingRows = ref([])
    const selected = ref(false)

    const pregnantVisible = ref(false)
    const pregnantMember = ref<Member>()
    const pregnantChildrenParent = ref<string>('')

    const onEditSave = (event: any) => {
        let { data, field, newValue } = event
        data[field] = newValue
    }

    const showMessage = (msg: string) => {
        toast.add({ severity: 'info', summary: 'Info', detail: msg, life: 3000 })
    }

    interface IShowData {
        members: {
            familys: Member[]
            spouses: Member[]
            guests: Member[]
        }
        items: { [key: ItemType]: number }
        currency: {
            [CurrencyType.Money]: number
            [CurrencyType.YuanBao]: number
        }
        family: {
            [FamilyType.SurName]: string
            [FamilyType.Level]: number
            [FamilyType.Exp]: number
        }
        NuLi: number
        fiefs: Map<string, Fief>
    }
    const showData = reactive<IShowData>({
        members: {
            familys: [],
            spouses: [],
            guests: []
        },
        items: {},
        currency: {},
        family: {},
        NuLi: 0,
        fiefs: new Map()
    })
    onMounted(() => {
        window['showData'] = showData
    })
    const familyMembersOptions = computed(() => {
        return showData.members.familys.map(m => ({
            label: m.name,
            value: m.id.toString() // 根据组件需求转换类型
        }))
    })

    const getShowData = (type: MemberType): Member[] => {
        if (type == MemberType.Family) {
            return showData.members.familys
        } else if (type == MemberType.Spouse) {
            return showData.members.spouses
        } else if (type == MemberType.Guest) {
            return showData.members.guests
        }
        return []
    }

    const setShowData = () => {
        console.log(getFiefs())
        showData.members.familys = getMembers(MemberType.Family)
        showData.members.spouses = getMembers(MemberType.Spouse)
        showData.members.guests = getMembers(MemberType.Guest)
        showData.items = getItems()
        showData.currency = {
            [CurrencyType.Money]: getCurrency(CurrencyType.Money),
            [CurrencyType.YuanBao]: getCurrency(CurrencyType.YuanBao)
        }
        showData.NuLi = getNuLi()
        showData.family = {
            [FamilyType.SurName]: getFamily(FamilyType.SurName),
            [FamilyType.Level]: getFamily(FamilyType.Level),
            [FamilyType.Exp]: getFamily(FamilyType.Exp)
        }
        showData.fiefs = getFiefs()
    }

    const updateData = () => {
        showData.members.familys.forEach(member => {
            updateMember(member)
        })
        showData.members.spouses.forEach(member => {
            updateMember(member)
        })
        showData.members.guests.forEach(member => {
            updateMember(member)
        })
        for (const key in showData.currency) {
            const value = showData.currency[key]
            updateCurrency(key as CurrencyType, value)
        }
        for (const key in showData.items) {
            const value = showData.items[key]
            setItem(key as CurrencyType, value)
        }
        updateNuli(showData.NuLi)
        for (const key in showData.family) {
            const value = showData.family[key]
            updateFamily(key as FamilyType, String(value))
        }
        for (const [key, value] of showData.fiefs) {
            updateFief(key, value.unlocked)
        }
    }

    const upAllItems = () => {
        console.log(showData.items)
        for (const key in ItemType) {
            showData.items[ItemType[key as keyof typeof ItemType]] = 1000000
        }
    }

    const upAllAttr = (member: Member) => {
        member.reputation = '100'
        member.health = '100'
        member.mood = '100'
        member.charm = '100'
        member.lucky = '100'
        member.wen = '100'
        member.wu = '100'
        member.shang = '100'
        member.yi = '100'
        member.mou = '100'
        if (member.talent != '0') {
            member.talentValue = '100'
        }
        if (member.skill != '0') {
            member.skillValue = '10'
        }
    }

    const upAge18 = (member: Member) => {
        if (!game.parsed) {
            console.error('jsonData is null')
            return
        }
        member.age = '18'
    }

    const upMembersAll = (type: MemberType) => {
        if (!game.parsed) {
            console.error('jsonData is null')
            return
        }
        if (type == MemberType.Family) {
            showData.members.familys.forEach(member => {
                upAllAttr(member)
            })
        } else if (type == MemberType.Spouse) {
            showData.members.spouses.forEach(member => {
                upAllAttr(member)
            })
        } else if (type == MemberType.Guest) {
            showData.members.guests.forEach(member => {
                upAllAttr(member)
            })
        }
    }
    const upMembersAge18 = (type: MemberType) => {
        if (!game.parsed) {
            console.error('jsonData is null')
            return
        }
        if (type == MemberType.Family) {
            showData.members.familys.forEach(member => {
                upAge18(member)
            })
        } else if (type == MemberType.Spouse) {
            showData.members.spouses.forEach(member => {
                upAge18(member)
            })
        } else if (type == MemberType.Guest) {
            showData.members.guests.forEach(member => {
                upAge18(member)
            })
        }
    }
    const clearPayment = (type: MemberType) => {
        if (!game.parsed) {
            console.error('jsonData is null')
            return
        }
        if (type === MemberType.Guest) {
            showData.members.guests.forEach(member => {
                member.payment = '0'
            })
        }
    }
    const pregnant = () => {
        if (!pregnantMember.value || !pregnantChildrenParent.value) {
            console.error('pregnant select error')
            pregnantVisible.value = false
            return
        }
        pregnantMember.value.pregnancy = '1'
        pregnantMember.value.pregnantChildrenParent = pregnantChildrenParent.value
        pregnantVisible.value = false
        console.log('pregnant: ', pregnantMember.value, pregnantChildrenParent.value)
    }

    const parse = async () => {
        console.log('parse')
        selected.value = false
        try {
            console.log(fileupload.value)
            const files = fileupload.value.files
            if (files.length === 0) return

            const file = files[0]
            const text = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = e => resolve(e.target?.result)
                reader.onerror = reject
                reader.readAsText(file)
            })
            game.parse(text as string)
            console.log('解析结果:', game)
            selected.value = true
            setShowData()
            //  填充展示
        } catch (error) {
            console.error('解析失败:', error)
            showMessage('文件格式错误，请确认是有效的JSON文件')
        }
    }

    const saveFile = async () => {
        if (!game.parsed) {
            showMessage('没有可保存的数据')
            return
        }
        updateData()
        try {
            const jsonString = JSON.stringify(game.data, null, 0)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)

            // 创建临时链接进行下载
            const a = document.createElement('a')
            a.href = url

            a.download = `GameData.es3`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            showMessage('文件保存成功')
        } catch (error) {
            console.error('保存失败:', error)
            showMessage('文件保存失败')
        }
    }
</script>

<template>
    <div style="justify-content: center">
        <h1>house-of-legacy</h1>
        <Divider />
        <div style="display: flex; justify-content: center; gap: 1rem">
            <FileUpload
                ref="fileupload"
                mode="basic"
                name="savefile"
                accept=".es3"
                chooseLabel="选择存档文件"
                @select="parse"
                :previewWidth="0"
            >
                <template #empty>
                    <span>拖入存档文件</span>
                </template>
            </FileUpload>
            <ButtonGroup>
                <Button
                    label="保存"
                    @click="saveFile"
                />
            </ButtonGroup>
        </div>

        <div
            v-if="selected"
            style="width: 80%; margin: 0 auto"
        >
            <Divider />
            <div class="editpannel">
                <Panel :header="(showData.family[FamilyType.SurName] as string) + '家'">
                    <div style="display: grid; grid-column: 1; gap: 4px">
                        <template v-for="(_, type) in showData.family">
                            <FloatLabel
                                variant="on"
                                v-if="type != FamilyType.SurName"
                            >
                                <InputNumber
                                    :min="0"
                                    v-model="showData.family[type] as number"
                                />
                                <label> {{ FamilyTypeName[type] }}</label>
                            </FloatLabel>
                        </template>
                        <h4>封地解锁</h4>
                        <div style="display: flex; justify-content: center; gap: 0.5rem">
                            <template v-for="[id, fief] of showData.fiefs">
                                <div
                                    v-if="fief.name != ''"
                                    :key="id"
                                >
                                    <Checkbox
                                        v-model="fief.unlocked"
                                        :inputId="id"
                                        :name="fief.name"
                                        binary
                                    />
                                    <label :for="id">{{ fief.name }}</label>
                                </div>
                            </template>
                        </div>
                    </div>
                </Panel>
                <Panel header="资源">
                    <div style="display: grid; grid-column: 1; gap: 4px">
                        <template v-for="(_, type) in showData.currency">
                            <FloatLabel variant="on">
                                <InputNumber
                                    :min="0"
                                    v-model="showData.currency[type]"
                                />
                                <label> {{ CurrencyTypeName[type] }}</label>
                            </FloatLabel>
                        </template>
                        <FloatLabel variant="on">
                            <InputNumber
                                :min="0"
                                v-model="showData.NuLi"
                            />
                            <label> 奴隶 </label>
                        </FloatLabel>
                    </div>
                </Panel>
                <Panel header="物品">
                    <template #icons>
                        <Button
                            label="全部100w"
                            @click.stop="upAllItems()"
                            size="small"
                            raised
                            text
                        >
                        </Button>
                    </template>
                    <ScrollPanel style="min-height: 100px">
                        <div
                            style="
                                display: grid;
                                grid-template-columns: repeat(3, 1fr);
                                gap: 6px;
                                padding: 5px;
                            "
                        >
                            <template v-for="type in ItemType">
                                <FloatLabel variant="on">
                                    <InputNumber
                                        :min="0"
                                        v-model="showData.items[type]"
                                    />
                                    <label> {{ ItemTypeName[type] }} </label>
                                </FloatLabel>
                            </template>
                        </div>
                    </ScrollPanel>
                </Panel>
            </div>
            <Divider />
            <template v-for="type in MemberType">
                <Panel toggleable>
                    <template #header>
                        <h3>{{ MemberTypeName[type] }}</h3>
                    </template>
                    <template #icons>
                        <ButtonGroup>
                            <Button
                                label="升满属性"
                                @click.stop="upMembersAll(type)"
                                size="small"
                                raised
                                text
                            />
                            <Button
                                label="18岁"
                                @click.stop="upMembersAge18(type)"
                                size="small"
                                raised
                                text
                                v-if="type === MemberType.Guest"
                            />
                            <Button
                                label="0薪酬"
                                @click.stop="clearPayment(type)"
                                size="small"
                                raised
                                text
                                v-if="type === MemberType.Guest"
                            />
                        </ButtonGroup>
                    </template>
                    <DataTable
                        class="card"
                        :value="getShowData(type)"
                        v-model:editingRows="editingRows"
                        editMode="cell"
                        @cell-edit-complete="onEditSave"
                        size="small"
                        stripedRows
                    >
                        <Column
                            field="name"
                            header="名字"
                            style="width: 8rem"
                        >
                            <template #body="{ data }">
                                <span v-if="type === MemberType.Family"
                                    >{{ data.generation }}|</span
                                >
                                <span>{{ data.name }}</span>
                            </template>
                        </Column>
                        <Column
                            field="gender"
                            header="性别"
                            style="width: 6rem"
                        >
                            <template #body="{ data }">
                                <OverlayBadge
                                    v-if="data.pregnancy != '-1'"
                                    :value="data.pregnancy"
                                    severity="warn"
                                    size="small"
                                >
                                    <span>{{ data.gender === '1' ? '男' : '女' }}</span>
                                </OverlayBadge>
                                <span v-else>{{ data.gender === '1' ? '男' : '女' }}</span>
                            </template>
                        </Column>
                        <Column
                            field="rank"
                            header="爵位"
                            style="width: 6rem"
                            v-if="type === MemberType.Family"
                        >
                            <template #body="{ data }">
                                {{
                                    MemberRankOptions.find(opt => opt.value === data.rank)?.label ||
                                    ''
                                }}
                            </template>
                            <template #editor="{ data }">
                                <Select
                                    v-model="data.rank"
                                    :options="MemberRankOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    size="small"
                                    filter
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column
                            field="reputation"
                            header="声誉"
                            style="width: 5rem"
                        >
                            <template #editor="{ data, field }">
                                <InputNumber
                                    v-model="data[field]"
                                    :min="0"
                                    :max="100"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column
                            field="stamina"
                            header="体力"
                            style="width: 4rem"
                        />
                        <Column
                            field="age"
                            header="年龄"
                            style="width: 5rem"
                        >
                            <template #body="{ data }"> {{ data.age }} / {{ data.life }} </template>
                            <template #editor="{ data }">
                                <InputNumber
                                    v-model="data.life"
                                    :min="data.age"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <!--人物4维-->
                        <template
                            v-for="(field, header) in {
                                健康: 'health',
                                心情: 'mood',
                                魅力: 'charm',
                                幸运: 'lucky'
                            }"
                            :key="field"
                        >
                            <Column
                                :field="field"
                                :header="header"
                                style="width: 5rem"
                            >
                                <template #editor="{ data, field }">
                                    <InputNumber
                                        v-model="data[field]"
                                        :min="0"
                                        :max="100"
                                        size="small"
                                        fluid
                                    />
                                </template>
                            </Column>
                        </template>
                        <Column
                            field="nature"
                            header="性格"
                            style="width: 7rem"
                        >
                            <template #body="{ data }">
                                {{
                                    MemberNatureOptions.find(opt => opt.value === data.nature)
                                        ?.label || ''
                                }}
                            </template>
                            <template #editor="{ data }">
                                <Select
                                    v-model="data.nature"
                                    :options="MemberNatureOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column
                            field="talent"
                            header="天赋"
                            style="width: 6rem"
                        >
                            <template #body="{ data }">
                                {{
                                    MemberTalentOptions.find(opt => opt.value === data.talent)
                                        ?.label || ''
                                }}
                            </template>
                            <template #editor="{ data }">
                                <Select
                                    v-model="data.talent"
                                    :options="MemberTalentOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column
                            field="talentValue"
                            header="天赋值"
                            style="width: 5rem"
                        >
                            <template #editor="{ data }">
                                <InputNumber
                                    v-model="data.talentValue"
                                    :min="0"
                                    :max="100"
                                    size="small"
                                    fluid
                                    :disabled="data.talent === '0'"
                                />
                            </template>
                        </Column>
                        <Column
                            field="skill"
                            header="技能"
                            style="width: 6rem"
                        >
                            <template #body="{ data }">
                                {{
                                    MemberSkillOptions.find(opt => opt.value === data.skill)
                                        ?.label || ''
                                }}
                            </template>
                            <template #editor="{ data }">
                                <Select
                                    v-model="data.skill"
                                    :options="MemberSkillOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column
                            field="skillValue"
                            header="技能值"
                            style="width: 5rem"
                        >
                            <template #editor="{ data }">
                                <InputNumber
                                    v-model="data.skillValue"
                                    :min="0"
                                    :max="10"
                                    size="small"
                                    fluid
                                    :disabled="data.skill === '0'"
                                />
                            </template>
                        </Column>
                        <!--5维-->
                        <template
                            v-for="(field, header) in {
                                文: 'wen',
                                武: 'wu',
                                商: 'shang',
                                艺: 'yi',
                                谋: 'mou'
                            }"
                            :key="field"
                        >
                            <Column
                                :field="field"
                                :header="header"
                                style="width: 5rem"
                            >
                                <template #editor="{ data, field }">
                                    <InputNumber
                                        v-model="data[field]"
                                        :min="0"
                                        :max="100"
                                        size="small"
                                        fluid
                                    />
                                </template>
                            </Column>
                        </template>
                        <Column
                            field="payment"
                            header="薪酬"
                            v-if="type === MemberType.Guest"
                            style="width: 5rem"
                        >
                            <template #editor="{ data, field }">
                                <InputNumber
                                    v-model="data[field]"
                                    :min="0"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column
                            field="status"
                            header="状态"
                            style="width: 5rem"
                            v-if="type === MemberType.Family"
                        >
                            <template #body="{ data }">
                                {{
                                    MemberStatusOptions.find(opt => opt.value === data.status)
                                        ?.label || ''
                                }}
                            </template>
                            <template #editor="{ data }">
                                <Select
                                    v-model="data.status"
                                    :options="MemberStatusOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column style="width: 8rem">
                            <template #body="{ data }">
                                <ButtonGroup>
                                    <Button
                                        label="升满属性"
                                        @click.stop="upAllAttr(data)"
                                        size="small"
                                        raised
                                        text
                                    />
                                    <Button
                                        label="18岁"
                                        @click.stop="upAge18(data)"
                                        size="small"
                                        raised
                                        text
                                        v-if="type === MemberType.Guest"
                                    />
                                    <Button
                                        label="立即怀孕"
                                        @click.stop="
                                            () => {
                                                pregnantVisible = true
                                                pregnantMember = data
                                            }
                                        "
                                        size="small"
                                        raised
                                        text
                                        v-if="data.gender == 0 && data.pregnancy == '-1'"
                                    />
                                </ButtonGroup>
                            </template>
                        </Column>
                    </DataTable>
                </Panel>
            </template>
        </div>
    </div>

    <Dialog
        v-model:visible="pregnantVisible"
        modal
        header="选择对象"
        :style="{ width: '25rem' }"
    >
        <Select
            v-model="pregnantChildrenParent"
            :options="familyMembersOptions"
            optionLabel="label"
            optionValue="value"
            size="small"
            filter
            fluid
        />
        <Button
            label="确认"
            @click.stop="pregnant"
            size="small"
            raised
            text
        />
    </Dialog>
</template>

<style scoped>
    .editpannel {
        display: flex;
        justify-content: space-around;
        gap: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>
