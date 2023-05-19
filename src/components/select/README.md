# 表单 Select

整个用法和 element 保持一致, 新增 `readonly` `data` `status` `text` `radio` `optionProps` 配置

## readonly
是否只读

## data
数据类型, 可以理解成 status 和 text 的组合
```javascript
[
  {
    code: '0', 
    name: '分类1'
  },
  {
    code: '1',
    name: '分类2'
  }
]
```

## status
单独传入 `分类` 的 `值`, 支持传入 `Array` `Object`, 必须与 `text` 参数一起使用, `status` 的传值类型不需要跟 `text` 保持一致
```javascript
// object
{
  ZERO: 0,
  ONE: 1
}
// array
[0 , 1]
```

## text
单独传入 `分类` 的 `描述`, 支持传入`Array` `Object`, 必须与 `status` 参数一起使用, `text` 的传值类型不需要跟 `status` 保持一致
```javascript
// object
{
  0: '我是零',
  1: '我是一'
}
// array
['我是零' , '我是一']
```

## labelKey

自定义 label 的主键

## valueKey

自定义 value 的主键

## radio
默认是 select 模式, 通过该参数可以切换成 radio 模式

## checked
// TODO
支持 checked 复选框模式

## optionProps
子组件的透传参数
