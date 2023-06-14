<script setup lang="ts">
import { ref } from 'vue'
import { ElInput } from 'element-plus'
import HSelect from '@/components/form/select/index.vue'
import HInput from '@/components/form/input/index.vue'
import { BkTable, BkTableColumn } from '@/components/form/table'

const input = ref(null)
const select = ref(null)
const max = ref(10)
const number = ref(true)
const multiple = ref(false)
const radio = ref(false)
const list = ref([
  {
    name: undefined,
    age: '18'
  }
])
const rules = ref({ name: { required: true, message: `请输入 `, trigger: ['change', 'blur'] } })

const refList = ref(null)

const COUPON_TYPE = ref({
  FULL_DECREMENT: 1,
  DISCOUNT: 2,
  HOTEL: 3,
  EXCHANGE: 4,
  CONSUME: 5
})

const COUPON_TYPE_TEXT = ref({
  [COUPON_TYPE.value.FULL_DECREMENT]: '满减券',
  [COUPON_TYPE.value.DISCOUNT]: '折扣券',
  [COUPON_TYPE.value.HOTEL]: '酒店券',
  [COUPON_TYPE.value.EXCHANGE]: '兑换券',
  [COUPON_TYPE.value.CONSUME]: '消费券'
})

const data = Object.keys(COUPON_TYPE.value).map(e => ({
  code: COUPON_TYPE.value[e],
  name: COUPON_TYPE_TEXT.value[COUPON_TYPE.value[e]]
}))

const handlevalidate = async () => {
  await refList.value.validate()
}

const handleclear = async () => {
  await refList.value.clearValidate()
}

const handlerefresh = () => {
  refList.value.refresh()
}

const fetchList = params => {
  const { pageIndex, pageSize = 10 } = params || {}

  return new Promise(resolve => {
    const count = pageIndex * 10
    const list = new Array(pageSize).fill('').map((e, i) => ({
      name: `name${count + i}`,
      age: `age${count + i}`
    }))

    setTimeout(() => {
      resolve({
        data: list,
        pageCount: 99,
        pageIndex,
        total: 99
      })
    }, 500)
  })
}
</script>

<template>
  <div>
    <h-select
      v-model="select"
      :multiple="multiple"
      :radio="radio"
      placement="right"
      :data="data"
      :status="COUPON_TYPE"
      :text="COUPON_TYPE_TEXT"
    />
    <h-input v-model="input" :number="number" :min="1" :max="max">
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
      <template #prepend>prepend</template>
      <template #append>append</template>
    </h-input>

    <div @click="handlevalidate">校验表单</div>
    <div @click="handleclear">清除表单校验</div>
    <div @click="handlerefresh">刷新</div>
    <bk-table
      ref="refList"
      stripe
      border
      :data="list"
      :rule-key="['name', 'age']"
      :rules="rules"
      :fetch-api="fetchList"
    >
      <bk-table-column prop="name" label="国家">
        <template #default="scope">
          <el-input v-model="scope.row.name" />
        </template>
      </bk-table-column>
      <bk-table-column prop="age" label="城市">
        <template #default="scope">
          <el-input v-model="scope.row.age" />
        </template>
      </bk-table-column>
    </bk-table>
  </div>
</template>
