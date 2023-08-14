<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'
import axios from 'axios'
import HSelect from '@/components/form/select/index.vue'
import HInput from '@/components/form/input/index.vue'
import { BkTable, BkTableColumn } from '@/components/form/table'
import BkUpload from '@/components/form/upload/index.vue'
import BkOssFile from '@/components/form/upload/components/oss-file/index.vue'
import BkSwitch from '@/components/form/switch/index.vue'
import BkLazySelect from '@/components/lazy-select/index.vue'
import BkDraggable from '@/components/draggable/index.vue'
import BkModal from '@/components/modal/index.vue'
import modal from './components/modal.vue'
import Tooltip from '@/components/tooltip/index.vue'

BkUpload.configApiUrl = 'http://vebk.test.gateway.huitravel.com/resource/sts/assumerole'

const input = ref(null)
const select = ref(null)
const max = ref(10)
const number = ref(false)
const multiple = ref(false)
const radio = ref(false)
const upload = ref([
  'development/tenant/common/d7a29509e59049309a7d104a8d47140b.jpeg',
  'development/tenant/common/2630e04922454406b93f9e4cc53eff77.png',
  'development/tenant/common/26674243ddbe4734b657bb34da440bf6.png'
])
const list = ref([
  { name: 'xiaoming', age: 1 },
  { name: 'xiaoming', age: 2 },
  { name: 'xiaoming', age: 3 },
  { name: 'xiaoming', age: 4 },
  { name: 'xiaodong', age: 5 },
  { name: 'xiaodong', age: 6 },
  { name: 'xiaodong', age: 7 },
  { name: 'xiaodong', age: 8 },
  { name: 'hong', age: 9 },
  { name: 'hong', age: 10 },
  { name: 'hong', age: 11 },
  { name: 'hong', age: 12 }
])

const rules = ref({ name: { required: true, message: `请输入 `, trigger: ['change', 'blur'] } })
const previewList = ref([
  'localhost/tenant/common/c2f90130b74948a38ce1ddf8cdd49c8e.png',
  'localhost/tenant/common/2f0c4db07a294a52b4c7b1921a8f6084.png'
])

const refList = ref(null)
const switchValue = ref(false)

const ruleFormRef = ref()
const ruleForm = reactive({
  name: undefined,
  url: []
})

const formRules = reactive({
  name: [{ required: true, message: 'Please input Activity name', trigger: ['change', 'blur'] }],
  url: [{ required: true, message: 'Please input Activity name', trigger: ['change', 'blur'] }]
})

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

const globalModalList = ref({
  test: () => import('./components/modal.vue')
})

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

const handleValidate = async () => {
  await ruleFormRef.value.validate()
}

const searchBank = async params => {
  const res = await axios.post(
    'http://vebk.test.gateway.huitravel.com/payment/bank/search',
    params,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }
  )

  return res?.data?.data
}

const handleCreate = () => {
  list.value.unshift({
    name: undefined,
    age: Date.now()
  })
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (!columnIndex) {
    const _row = rowIndex === 0 || rowIndex === 4 || rowIndex === 8 ? 4 : 0
    const _col = _row ? 1 : 0

    return {
      rowspan: _row,
      colspan: _col
    }
  }
}

const { proxy }: any = getCurrentInstance()

const openModal = () => {
  proxy.$modal.show(
    'test',
    {
      name: 'xiaoming'
    },
    {
      asd: () => {},
      ok: () => {
        console.log('ok')
      }
    }
  )
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
    <h-input v-model="input" :number="number" :min="1" :max="max" type="number">
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
      <template #prepend>prepend</template>
      <template #append>append</template>
    </h-input>

    <bk-lazy-select
      :data="searchBank"
      name-key="name"
      row-key="bankCode"
      not-found-content="没有数据"
    />

    <bk-switch v-model="switchValue" title="qwe" tips="qwe">asdasdadasd</bk-switch>

    <div @click="handleValidate">校验</div>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" label-width="120px">
      <el-form-item label="name" prop="name">
        <el-input v-model="ruleForm.name" :max="99" acl />
      </el-form-item>
      <el-form-item label="上传" prop="url">
        <bk-upload v-model="ruleForm.url" :max="19" acl />
      </el-form-item>
    </el-form>

    <bk-oss-file
      url="localhost/tenant/common/dbb1864713ad4f748329f4176f101ef4.mp4"
      :file-list="previewList"
    />
    <bk-oss-file url="localhost/tenant/common/c2f90130b74948a38ce1ddf8cdd49c8e.png" />
    <bk-oss-file
      url="localhost/tenant/common/2f0c4db07a294a52b4c7b1921a8f6084.png"
      :file-list="previewList"
    />

    <bk-table
      ref="refList"
      stripe
      border
      drag="multiple"
      :data="list"
      :rules="rules"
      row-key="age"
      :show-pagination="false"
      :row-class-name="({ row }) => `drag_${row.name} dragid_${row.age}`"
      :span-method="objectSpanMethod"
    >
      <bk-table-column prop="name" label="国家">
        <template #default="scope">
          <el-input v-model="scope.row.name" class="dragaaa" />
        </template>
      </bk-table-column>
      <bk-table-column prop="age" label="城市">
        <template #default="scope">
          <el-input v-model="scope.row.age" />
        </template>
      </bk-table-column>
    </bk-table>

    <div @click="handlevalidate">校验表单</div>
    <div @click="handleclear">清除表单校验</div>
    <div @click="handlerefresh">刷新</div>
    <div @click="handleCreate">增加一行</div>
    <bk-table
      ref="refList"
      :data="list"
      stripe
      border
      drag
      height="300"
      layout="total, sizes, prev, pager, next, ->"
      row-key="age"
      :show-pagination="true"
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

    <div @click="openModal">打开弹窗</div>
    <bk-modal :list="globalModalList" />

    <div style="width: 100px">
      <tooltip line="2" content="1">
        <template #content>
          <div>123</div>
          <div>123</div>
        </template>
      </tooltip>
    </div>
  </div>
</template>
