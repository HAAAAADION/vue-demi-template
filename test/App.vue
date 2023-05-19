<script setup lang="ts">
import HSelect from '@/components/select'
import HInput from '@/components/input'
import { HTable, HTableColumn } from '@/components/table'
import { ElTable } from 'element-plus'
</script>

<template>
  <div>
    <h-select :data="[]" />
    <h-input />
    <h-table>
      <h-table-column></h-table-column>
    </h-table>
    <el-table />
  </div>
</template>
