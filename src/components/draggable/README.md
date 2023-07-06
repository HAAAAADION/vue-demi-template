# 拖拽组件

基于 [SortableJS](https://github.com/SortableJS/Sortable) + Element Table 进行封装, 支持自定义渲染拖拽/表格拖拽

## rowKey

渲染主键, 默认为 `id`, 仅在使用 slots.item 进行渲染时有用

```vue
<bk-draggable v-model="list" row-key="age">
  <!-- ... -->
</bk-draggable>
```

## options

透传进 SortableJS 的自定义参数, 与官方一致 

```vue
<bk-draggable v-model="list" :options="{ handle: '.handle' }">
  <!-- ... -->
</bk-draggable>
```

## 各种用法

### 结合 ElTable

ElTable 用法无改变, 只需要用 `BkDraggable` 组件进行嵌套即可

```vue
<bk-draggable v-model="list">
  <bk-table ref="refList" stripe border :data="list" row-key="age">
    <bk-table-column prop="name" label="姓名">
      <template #default="scope">
        <el-input v-model="scope.row.name" />
      </template>
    </bk-table-column>
    <bk-table-column prop="age" label="年龄">
      <template #default="scope">
        <el-input v-model="scope.row.age" />
      </template>
    </bk-table-column>
  </bk-table>
</bk-draggable>
```

### 自定义列表选择

自定义列表渲染必须自定义设置 `:key` 避免重新渲染异常

```vue
<bk-draggable v-model="list">
  <div v-for="item in list" :key="item.age">{{ item }}</div>
</bk-draggable>
```

### 使用 slots.item 进行渲染

使用该方式进行渲染时需要考虑 `rowKey` 参数避免排序重新渲染时异常

```vue
<bk-draggable v-model="list" row-key="age">
  <span slot="item" slot-scope="{ item }">{{ item }}</span>
</bk-draggable>
```

**另外需要注意的是, 由于 vue2 的渲染问题, 在内部渲染 `slots.item` 时会用 `<span>` 标签作为父组件进行渲染**
