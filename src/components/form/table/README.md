# 表单表格组件

该组件是对 [lazy-table](../../lazy-table/README.md) 组件的二次封装, 在原有基础上增加 from 表单校验, 基础用法如下: 

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

## 暴露方法

### refresh

与 `lazy-table` 一致

### refreshCurrentPage

与 `lazy-table` 一致

### validate

校验表单字段, 可自定义校验某个字段/某一行的字段, 不传参数默认全部校验, 基础用法: 

```javascript
${ref}.validate(key?: string | string[], index?: number)
```

### clearValidate

清除表单校验, 可自定义清除某个字段/某一行的校验, 不传参数默认清除全部校验, 基础用法:

```javascript
${ref}.clearValidate(key?: string | string[], index?: number)
```
