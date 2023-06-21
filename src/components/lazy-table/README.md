# 异步表格组件

表格的用法与`el-table`保持一致, 整合了分页器和支持接口自动异步调用, 基础用法如下:

```vue
<lazy-table
  ref="refLazyTable"
  :fetch-api="fetchData"
  :show-pagination="boolean"
  :page-size="pageSize"
  :auto-fetch="autoFetch"
>
    <el-table-column prop="name" label="国家">
      <template #default="scope">
        <el-input v-model="scope.row.name" />
      </template>
    </el-table-column>
    <el-table-column prop="age" label="城市">
      <template #default="scope">
        <el-input v-model="scope.row.age" />
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-input v-if="scope.$index" v-model="scope.row.age" />
      </template>
    </el-table-column>
</lazy-table>
```

## fetchApi

该参数支持动态请求列表数据, 业务可自定义异步函数, 但需要注意该方法必须返回一个 Promise, 一般来说, 直接返回接口返回即可, 如:

```javascript
<h-table :fetch-api="fetchSomeApi"></h-table>
// ...
methods: {
  fetchSomeApi(params) {
    return Promise.resolve({
      data: Array<{}>, 
      pageCount: numbner, 
      pageIndex: numbner,
      total: numbner
    })
  }
}
```

## autoFetch

是否默认请求(类 created 时机)异步接口, 该参数需要和 fetchApi 组合使用, 默认开启

## showPagination

是否展示分页组件, 使用 `fetchApi` 会自动展示分页器

## pageSize

列表每页最大长度, 传入后会自动插入构建分页长度数组, 默认值为: [10, 20, 30, 40, 50, 100]

如 pageSize="11", 值为: [10, 11, 20, 30, 40, 50, 100]

## 暴露方法

### refresh

刷新整个表格数据, 基本用法:

```javascript
${ref}.refresh(params)
```

通过 `.refresh` 传入的参数会在组件内部进行维护, 比如搜索参数, 外部不想要另外进行维护, 则可作为参数传入, 每次接口调用都会把参数重新传递给外部

### refreshCurrentPage

刷新表格当前页, 基本用法:

```javascript
${ref}.refreshCurrentPage()
```
