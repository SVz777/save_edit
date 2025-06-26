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
        MemberStatusOptions
    } from '@/types/house-of-legacy/member'
    import {
        CurrencyType,
        CurrencyTypeName,
        getCurrency,
        updateCurrency
    } from '@/types/house-of-legacy/currency'
    import { getItems, ItemType, ItemTypeName, setItem } from '@/types/house-of-legacy/item'
    import { reactive, ref } from 'vue'
    import { useToast } from 'primevue/usetoast'
    const fileupload = ref()
    const { game } = useGameStore()
    const toast = useToast()
    const editingRows = ref([])
    const selected = ref(false)

    const onRowEditSave = (event: any) => {
        let { newData } = event
        updateMember(newData)
    }

    const showMessage = (msg: string) => {
        toast.add({ severity: 'info', summary: 'Info', detail: msg, life: 3000 })
    }

    const showData = reactive<{
        familys: Member[]
        spouses: Member[]
        guests: Member[]
        items: { [key: ItemType]: number }
        currency: {
            [CurrencyType.Money]: number
            [CurrencyType.YuanBao]: number
        }
    }>({
        familys: [],
        spouses: [],
        guests: [],
        items: {},
        currency: {}
    })

    const getShowData = (type: MemberType): Member[] => {
        if (type == MemberType.Family) {
            return showData.familys
        } else if (type == MemberType.Spouse) {
            return showData.spouses
        } else if (type == MemberType.Guest) {
            return showData.guests
        }
        return []
    }

    const UpdateCurrency = () => {
        for (const key in showData.currency) {
            updateCurrency(key, showData.currency[key])
        }
        showMessage('修改成功')
    }

    const upAll = (member: Member) => {
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
            member.skillValue = '100'
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
            showData.familys.forEach(member => {
                upAll(member)
            })
        } else if (type == MemberType.Spouse) {
            showData.spouses.forEach(member => {
                upAll(member)
            })
        } else if (type == MemberType.Guest) {
            showData.guests.forEach(member => {
                upAll(member)
            })
        }
    }
    const upMembersAge18 = (type: MemberType) => {
        if (!game.parsed) {
            console.error('jsonData is null')
            return
        }
        if (type == MemberType.Family) {
            showData.familys.forEach(member => {
                upAge18(member)
            })
        } else if (type == MemberType.Spouse) {
            showData.spouses.forEach(member => {
                upAge18(member)
            })
        } else if (type == MemberType.Guest) {
            showData.guests.forEach(member => {
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
            showData.guests.forEach(member => {
                member.payment = '0'
            })
        }
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

            showData.familys = getMembers(MemberType.Family)
            showData.spouses = getMembers(MemberType.Spouse)
            showData.guests = getMembers(MemberType.Guest)
            showData.items = getItems()
            showData.currency = {
                [CurrencyType.Money]: getCurrency(CurrencyType.Money),
                [CurrencyType.YuanBao]: getCurrency(CurrencyType.YuanBao)
            }
        } catch (error) {
            console.error('解析失败:', error)
            showMessage('文件格式错误，请确认是有效的JSON文件')
        }
    }

    const updateData = () => {
        showData.familys.forEach(member => {
            updateMember(member)
        })
        showData.spouses.forEach(member => {
            updateMember(member)
        })
        showData.guests.forEach(member => {
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
    <div style="padding: 10px">
        <h1>house-of-legacy</h1>
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
        <div v-if="selected">
            <div class="editpannel">
                <Panel header="货币">
                    <div style="display: grid; grid-column: 1; gap: 4px">
                        <template v-for="(_, type) in showData.currency">
                            <InputGroup>
                                <InputGroupAddon>
                                    {{ CurrencyTypeName[type] }}
                                </InputGroupAddon>
                                <InputNumber
                                    :min="0"
                                    v-model="showData.currency[type]"
                                />
                            </InputGroup>
                        </template>
                    </div>
                </Panel>
                <Panel header="物品">
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
                                <InputGroup>
                                    <InputGroupAddon> {{ ItemTypeName[type] }} </InputGroupAddon>
                                    <InputNumber
                                        :min="0"
                                        v-model="showData.items[type]"
                                    />
                                </InputGroup>
                            </template>
                        </div>
                    </ScrollPanel>
                </Panel>
            </div>
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
                        :value="getShowData(type)"
                        v-model:editingRows="editingRows"
                        editMode="row"
                        @row-edit-save="onRowEditSave"
                        size="small"
                        stripedRows
                        tableStyle="min-width: 50rem"
                    >
                        <Column
                            field="name"
                            header="名字"
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
                        >
                            <template #body="{ data }">
                                {{ data.gender === '1' ? '男' : '女' }}
                            </template>
                            <template #editor="{ data }">
                                <Select
                                    v-model="data.gender"
                                    :options="[
                                        { label: '男', value: '1' },
                                        { label: '女', value: '0' }
                                    ]"
                                    optionLabel="label"
                                    optionValue="value"
                                    size="small"
                                    fluid
                                />
                            </template>
                        </Column>
                        <Column
                            field="rank"
                            header="爵位"
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
                        />
                        <Column
                            field="age"
                            header="年龄"
                        />
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
                            field="talent"
                            header="天赋"
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
                            header="天赋数值"
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
                            header="技能数值"
                        >
                            <template #editor="{ data }">
                                <InputNumber
                                    v-model="data.skillValue"
                                    :min="0"
                                    :max="100"
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
                        <Column :rowEditor="true" />
                        <Column>
                            <template #body="{ data }">
                                <ButtonGroup>
                                    <Button
                                        label="升满属性"
                                        @click.stop="upAll(data)"
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
                                </ButtonGroup>
                            </template>
                        </Column>
                    </DataTable>
                </Panel>
            </template>
        </div>
    </div>
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
