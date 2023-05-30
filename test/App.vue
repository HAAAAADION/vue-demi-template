<script setup lang="ts">
import { ref } from 'vue'
import HSelect from '@/components/select/index.vue'
import HInput from '@/components/input/index.vue'
// import { HTable, HTableColumn } from '@/components/table'
import { ElTable } from 'element-plus'

var a = ref('')
var select = ref(2)

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
</script>

<template>
  <div>
    <h-select
      v-model="select"
      :multiple="true"
      placement="right"
      :status="COUPON_TYPE"
      :text="COUPON_TYPE_TEXT"
      style="margin-top: 200px"
      radio
    ></h-select>
    <h-input v-model="a" :min="5" :max="10" textarea>
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
      <template #prepend>prepend</template>
      <template #append>append</template>
    </h-input>
    <!--    <h-table>-->
    <!--      <h-table-column></h-table-column>-->
    <!--    </h-table>-->
    <!--    <el-table />-->
  </div>
</template>
