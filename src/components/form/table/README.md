# 表单表格组件

除了调用的组件不同之外, 表格的用法与`el-table`保持一致, 基础用法如下: 

```javascript
export default {
  // ...
  data() {
    return {
      list: [
        {
          date: undefined,
          name: undefined,
          address: undefined
        },
        {
          date: undefined,
          name: undefined,
          address: undefined
        }
      ],
      rules: {
        date: [
          { required: true, message: '请输入日期', trigger: ['change', 'blur'] }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: ['change', 'blur'] }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: ['change', 'blur'] }
        ]
      }
    }
  }
  // ...
}
```

```vue
<h-table ref="refList" :data="list" :rules="rules" :rule-key="['date', 'name']">
  <h-table-column prop="date" label="日期" width="180">
    <el-input v-model="row.date" slot-scope="{ row }" />
  </h-table-column>
  <h-table-column prop="name" label="姓名" width="180">
    <el-input v-model="row.name" slot-scope="{ row }" />
  </h-table-column>
  <h-table-column prop="address" label="地址">
    <el-input v-model="row.address" slot-scope="{ row }" />
  </h-table-column>
</h-table>
```

## ruleKey

> 用于快速构建列表的必填规则

只传入`ruleKey`会自动构建对应字段的必填`rule`, 最终规则结果等同于: 
```javascript
// 模版调用
<bk-table :rule-key="['date', 'name']" />

// 自动生成的规则
data() {
  return {
    rules: {
      date: [
        { required: true, message: '请输入 date', trigger: ['change', 'blur'] }
      ],
      name: [
        { required: true, message: '请输入 name', trigger: ['change', 'blur'] }
      ]
    }
  }
}
```

由于只有规则的 key 字段, 组件内部无法找到对应的规则文案, 因此构建的文案可能不完全适用于业务输出提示, 具体业务需根据自身需要适用

### 和 rules 字段一起传入

在实际业务中校验的规则总是多样化的, 比如还需要校验手机号码等, 因此还是可以适用原来的`rules`进行自定义规则

`ruleKey`字段也可以和`rules`一起传入, 比如只有`date`字段需要自定义规则

在构建规则阶段，会以`rules`的规则为主, 不再自动生成必填規則, 因此业务需要完全定义校验规则

## fetchApi

该参数支持动态请求列表数据, 业务可自定义异步函数, 但需要注意该方法必须返回一个 Promise, 一般来说, 直接返回接口返回即可, 如:

```javascript
<h-table :fetch-api="fetchSomeApi"></h-table>
// ...
methods: {
  fetchSomeApi() {
    return Promise.resolve({
      data: Array<{}>, 
      pageCount: numbner, 
      pageIndex: numbner,
      total: numbner
    })
  }
}
```

如需要刷新页面或自定义调用时机等, 外部可通过 {ref}.refresh(query) 进行刷新, 传入的 query 会在组件内部进行维护额外的参数, 比如搜索参数, 外部不想要另外进行维护, 则可作为参数传入

## autoFetch

是否默认请求(类 created 时机)异步接口, 该参数需要和 fetchApi 组合使用, 默认开启

## showPagination

是否展示分页组件, 使用 `fetchApi` 会自动展示分页器

## pageSize

列表每页最大长度, 传入后会自动插入构建分页长度数组, 默认值为: [10, 20, 30, 40, 50, 100]
