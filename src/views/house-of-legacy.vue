<script setup lang="ts">
    import { useGameStore } from '@/store/gameStore'
    import { type Member, getMembers, setMember } from '@/types/house-of-legacy/member'
    import { Type } from '@/types/house-of-legacy/vars'
    import { computed, ref } from 'vue'
    const fileupload = ref()
    const { data } = useGameStore()
    const messageVisible = ref(false)
    const messageInfo = ref('')
    const showMessage = (msg: string) => {
        messageVisible.value = true
        messageInfo.value = msg
        setTimeout(() => {
            messageVisible.value = false
            messageInfo.value = ''
        }, 3500)
    }

    const selected = ref(false)

    const familys = computed(() => {
        if (!data || !data.value) return []
        let d = getMembers(Type.Family)
        console.log(d)
        return d
    })

    const spouses = computed(() => {
        if (!data || !data.value) return []
        let d = getMembers(Type.Spouse)
        console.log(d)
        return d
    })

    const guests = computed(() => {
        if (!data || !data.value) return []
        let d = getMembers(Type.Guest)
        console.log(d)
        return d
    })

    const upAll = (member: Member) => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        member.health = 100
        member.mood = 100
        member.charm = 100
        member.lucky = 100
        member.wen = 100
        member.wu = 100
        member.shang = 100
        member.yi = 100
        member.mou = 100

        setMember(Type.Family, member.idx, member)
    }

    const upFamilysAll = () => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        familys.value.forEach(member => {
            upAll(member)
        })
    }
    const upFamilysAge18 = () => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        familys.value.forEach(member => {
            upAge18(member)
        })
    }

    const upAge18 = (member: Member) => {
        if (!data || !data.value) {
            console.error('jsonData is null')
            return
        }
        member.age = 18
        setMember(Type.Family, member.idx, member)
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
            const jsonString = JSON.stringify(data.value, null, 2)
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
        <Panel toggleable>
            <template #header>
                <h3>家族成员</h3>
            </template>
            <template #icons>
                <ButtonGroup>
                    <Button
                        label="升满属性"
                        @click.stop="upFamilysAll"
                        size="small"
                        severity="success"
                        raised
                        text
                    />
                    <Button
                        label="18"
                        @click.stop="upFamilysAge18"
                        size="small"
                        severity="success"
                        raised
                        text
                    />
                </ButtonGroup>
            </template>
            <DataTable
                :value="familys"
                tableStyle="min-width: 50rem"
                editMode="row"
                size="small"
            >
                <Column
                    field="name"
                    header="名字"
                />
                <Column
                    field="generation"
                    header="第几代"
                />
                <Column
                    field="rank"
                    header="爵位"
                />
                <Column
                    field="reputation"
                    header="声誉"
                />
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
                />
                <Column
                    field="mood"
                    header="心情"
                />
                <Column
                    field="charm"
                    header="魅力"
                />
                <Column
                    field="lucky"
                    header="幸运"
                />
                <Column
                    field="talent"
                    header="天赋"
                />
                <Column
                    field="talentValue"
                    header="天赋数值"
                />
                <Column
                    field="skill"
                    header="技能"
                />
                <Column
                    field="skillValue"
                    header="技能数值"
                />
                <Column
                    field="wen"
                    header="文"
                />
                <Column
                    field="wu"
                    header="武"
                />
                <Column
                    field="shang"
                    header="商"
                />
                <Column
                    field="yi"
                    header="艺"
                />
                <Column
                    field="mou"
                    header="谋"
                />
                <Column :rowEditor="true" />
                <Column>
                    <template #body="{ data }">
                        <ButtonGroup>
                            <Button
                                label="升满属性"
                                @click="upAll(data)"
                            />
                            <Button
                                label="18岁"
                                @click="upAge18(data)"
                            />
                        </ButtonGroup>
                    </template>
                </Column>
            </DataTable>
        </Panel>
        <Panel toggleable>
            <template #header>
                <h3>家族嫁娶成员</h3>
            </template>
            <template #icons>
                <ButtonGroup>
                    <Button
                        label="升满属性"
                        @click.stop="upFamilysAll"
                        size="small"
                        severity="success"
                        raised
                        text
                    />
                    <Button
                        label="18"
                        @click.stop="upFamilysAge18"
                        size="small"
                        severity="success"
                        raised
                        text
                    />
                </ButtonGroup>
            </template>
            <DataTable
                :value="spouses"
                tableStyle="min-width: 50rem"
                editMode="row"
                size="small"
            >
                <Column
                    field="name"
                    header="名字"
                />
                <Column
                    field="reputation"
                    header="声誉"
                />
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
                />
                <Column
                    field="mood"
                    header="心情"
                />
                <Column
                    field="charm"
                    header="魅力"
                />
                <Column
                    field="lucky"
                    header="幸运"
                />
                <Column
                    field="talent"
                    header="天赋"
                />
                <Column
                    field="talentValue"
                    header="天赋数值"
                />
                <Column
                    field="skill"
                    header="技能"
                />
                <Column
                    field="skillValue"
                    header="技能数值"
                />
                <Column
                    field="wen"
                    header="文"
                />
                <Column
                    field="wu"
                    header="武"
                />
                <Column
                    field="shang"
                    header="商"
                />
                <Column
                    field="yi"
                    header="艺"
                />
                <Column
                    field="mou"
                    header="谋"
                />
                <Column :rowEditor="true" />
                <Column>
                    <template #body="{ data }">
                        <ButtonGroup>
                            <Button
                                label="升满属性"
                                @click="upAll(data)"
                            />
                            <Button
                                label="18岁"
                                @click="upAge18(data)"
                            />
                        </ButtonGroup>
                    </template>
                </Column>
            </DataTable>
        </Panel>
        <Panel toggleable>
            <template #header>
                <h3>门客</h3>
            </template>
            <template #icons>
                <ButtonGroup>
                    <Button
                        label="升满属性"
                        @click.stop="upFamilysAll"
                        size="small"
                        severity="success"
                        raised
                        text
                    />
                    <Button
                        label="18"
                        @click.stop="upFamilysAge18"
                        size="small"
                        severity="success"
                        raised
                        text
                    />
                </ButtonGroup>
            </template>
            <DataTable
                :value="guests"
                tableStyle="min-width: 50rem"
                editMode="row"
                size="small"
            >
                <Column
                    field="name"
                    header="名字"
                />
                <Column
                    field="reputation"
                    header="声誉"
                />
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
                />
                <Column
                    field="mood"
                    header="心情"
                />
                <Column
                    field="charm"
                    header="魅力"
                />
                <Column
                    field="lucky"
                    header="幸运"
                />
                <Column
                    field="talent"
                    header="天赋"
                />
                <Column
                    field="talentValue"
                    header="天赋数值"
                />
                <Column
                    field="skill"
                    header="技能"
                />
                <Column
                    field="skillValue"
                    header="技能数值"
                />
                <Column
                    field="wen"
                    header="文"
                />
                <Column
                    field="wu"
                    header="武"
                />
                <Column
                    field="shang"
                    header="商"
                />
                <Column
                    field="yi"
                    header="艺"
                />
                <Column
                    field="mou"
                    header="谋"
                />
                <Column :rowEditor="true" />
                <Column>
                    <template #body="{ data }">
                        <ButtonGroup>
                            <Button
                                label="升满属性"
                                @click="upAll(data)"
                            />
                            <Button
                                label="18岁"
                                @click="upAge18(data)"
                            />
                        </ButtonGroup>
                    </template>
                </Column>
            </DataTable>
        </Panel>
    </div>
    <Message
        v-if="messageVisible"
        severity="success"
        :life="3000"
        >{{ messageInfo }}</Message
    >
</template>

<style scoped></style>
