<script setup lang="ts">
    import { useGameStore } from '@/store/gameStore'
    import { type Member, getMembers, updateMember } from '@/types/house-of-legacy/member'
    import {
        Type,
        TypeName,
        MemberTalentOptions,
        MemberSkillOptions
    } from '@/types/house-of-legacy/vars'
    import { computed, ref, watchEffect } from 'vue'
    const fileupload = ref()
    const { data } = useGameStore()
    const messageVisible = ref(false)
    const messageInfo = ref('')
    const editingRows = ref([])
    const selected = ref(false)

    const onRowEditSave = (event: any) => {
        let { newData } = event
        updateMember(newData)
    }

    const showMessage = (msg: string) => {
        messageVisible.value = true
        messageInfo.value = msg
        setTimeout(() => {
            messageVisible.value = false
            messageInfo.value = ''
        }, 3500)
    }

    const showData = computed(() => {
        if (!data || !data.value) return []
        let familys = getMembers(Type.Family)
        let spouses = getMembers(Type.Spouse)
        let guests = getMembers(Type.Guest)
        return {
            familys,
            spouses,
            guests
        }
    })

    const getShowData = (type: Type): Member[] => {
        if (type == Type.Family) {
            return showData.value.familys
        } else if (type == Type.Spouse) {
            return showData.value.spouses
        } else if (type == Type.Guest) {
            return showData.value.guests
        }
        return []
    }

    const upAll = (member: Member) => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        member.health = '100'
        member.mood = '100'
        member.charm = '100'
        member.lucky = '100'
        member.wen = '100'
        member.wu = '100'
        member.shang = '100'
        member.yi = '100'
        member.mou = '100'

        updateMember(member)
    }

    const upAge18 = (member: Member) => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        member.age = '18'
        updateMember(member)
    }

    const upMembersAll = (type: Type) => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        if (type == Type.Family) {
            showData.value.familys.forEach(member => {
                upAll(member)
            })
        } else if (type == Type.Spouse) {
            showData.value.spouses.forEach(member => {
                upAll(member)
            })
        } else if (type == Type.Guest) {
            showData.value.guests.forEach(member => {
                upAll(member)
            })
        }
    }
    const upMembersAge18 = (type: Type) => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        if (type == Type.Family) {
            showData.value.familys.forEach(member => {
                upAge18(member)
            })
        } else if (type == Type.Spouse) {
            showData.value.spouses.forEach(member => {
                upAge18(member)
            })
        } else if (type == Type.Guest) {
            showData.value.guests.forEach(member => {
                upAge18(member)
            })
        }
    }

    const parse = async () => {
        console.log('parse')
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

            data.value = JSON.parse(text as string)
            console.log('解析结果:', data.value)
            selected.value = true
        } catch (error) {
            console.error('解析失败:', error)
            showMessage('文件格式错误，请确认是有效的JSON文件')
        }
    }

    const save = async () => {
        if (!data || !data.value) {
            showMessage('没有可保存的数据')
            return
        }
        try {
            const jsonString = JSON.stringify(data.value, null, 0)
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
                @click="save"
            />
        </ButtonGroup>
    </div>
    <div v-if="selected">
        <template v-for="type in Type">
            <Panel toggleable>
                <template #header>
                    <h3>{{ TypeName[type] }}</h3>
                </template>
                <template #icons>
                    <ButtonGroup>
                        <Button
                            label="升满属性"
                            @click.stop="upMembersAll(type)"
                            size="small"
                            severity="success"
                            raised
                            text
                        />
                        <Button
                            label="18"
                            @click.stop="upMembersAge18(type)"
                            size="small"
                            severity="success"
                            raised
                            text
                        />
                    </ButtonGroup>
                </template>
                <DataTable
                    :value="getMembers(type)"
                    tableStyle="min-width: 50rem"
                    v-model:editingRows="editingRows"
                    editMode="row"
                    @row-edit-save="onRowEditSave"
                    size="small"
                >
                    <Column
                        field="name"
                        header="名字"
                    />
                    <Column
                        header="性别"
                    >
                        <template #body="slotProps">
                            {{ slotProps.data.gender === '1'? '男':'女' }}
                        </template>
                    </Column>
                    <Column
                        field="generation"
                        header="第几代"
                        v-if="type === Type.Family"
                    />
                    <Column
                        field="rank"
                        header="爵位"
                        v-if="type === Type.Family"
                    />
                    <Column
                        field="reputation"
                        header="声誉"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
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
                    <Column
                        field="health"
                        header="健康"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column
                        field="mood"
                        header="心情"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column
                        field="charm"
                        header="魅力"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column
                        field="lucky"
                        header="幸运"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column header="天赋">
                        <template #body="slotProps">
                            {{ MemberTalentOptions[slotProps.data.talent].label }}
                        </template>
                    </Column>
                    <Column
                        field="talentValue"
                        header="天赋数值"
                    />
                    <Column header="技能">
                        <template #body="slotProps">
                            {{ MemberSkillOptions[slotProps.data.skill].label }}
                        </template>
                    </Column>
                    <Column
                        field="skillValue"
                        header="技能数值"
                    />
                    <Column
                        field="wen"
                        header="文"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column
                        field="wu"
                        header="武"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column
                        field="shang"
                        header="商"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column
                        field="yi"
                        header="艺"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column
                        field="mou"
                        header="谋"
                    >
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" />
                        </template>
                    </Column>
                    <Column :rowEditor="true" />
                    <Column>
                        <template #body="{ data }">
                            <ButtonGroup>
                                <Button
                                    label="升满属性"
                                    @click.stop="upAll(data)"
                                />
                                <Button
                                    label="18岁"
                                    @click.stop="upAge18(data)"
                                />
                            </ButtonGroup>
                        </template>
                    </Column>
                </DataTable>
            </Panel>
        </template>
    </div>
    <Message
        v-if="messageVisible"
        severity="success"
        :life="3000"
        >{{ messageInfo }}</Message
    >
</template>

<style scoped></style>
