<p align="center">
  <img width="128px" src="./example/assets/logo.png">
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/vue-simple-json">
  <img src="https://img.shields.io/npm/v/vue-simple-json.svg">
  </a>
  <a href="https://npmcharts.com/compare/vue-simple-json?minimal=true">
  <img src="https://img.shields.io/npm/dm/vue-simple-json.svg?color=357C3C">
  </a>
  <a href="https://npmcharts.com/compare/vue-simple-json?minimal=true">
  <img src="https://img.shields.io/npm/l/vue-simple-json.svg?color=blue">
  </a>
  <br>
</p>

<p align="center">极简的 jsonEditor 插件</p>

## 安装

> 强烈推荐使用pnpm

```shell

# pnpm
pnpm add vue-simple-json
# yarn
yarn add vue-simple-json
# npm
npm install vue-simple-json

```

## 使用

[详见example](https://github.com/HitStarrySky/vue-simple-json/tree/master/example/App.vue)

## 特性

* ✊ Vue 3 Composition API
* 🔥 TypeScript 开发，提供完整的类型定义文件。

## 功能支持

* 节点自定义
* 自定义输入类型 可配合主流 UI 框架
* 自定义 key 值颜色
* 展开层级
* 自定义操作

## demo


![案例](./template/demo.jpg)


## 文档

### 基础属性

| 参数         | 说明             | 类型    | 默认值(示例)                           |
| ------------ | ---------------- | ------- | -------------------------------------- |
| json         | json 传入参数    | Array   | 需要使用 deepAnalysisJson(该函数组件导出，可自定义) 解析后的数据 |
| disabled     | 是否禁用编辑     | Boolean | false                                  |
| extend-all   | 是否展开全部层级 | Boolean | false                                  |
| extend-level | 展开层级         | Number  | 1 （优先级小于 extend-all）            |
| config       | 配置             | object  | 见下 config 配置                       |

### config 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| keyColor | key 值（根据 type 类型设置）对应颜色 | object | 默认：{string:'#71aff1'} |
| allowType | 允许类型，可自定义类型 | Array | [{type: 'boolean', desc: '布尔值', default:false, slot: false}] |
| appendOperate | 追加操作 | Array | 见下 appendOperate 配置 |
| showHover | 是否展示 hover 效果 | Boolean | true |
| addType | 属性添加位置 | Boolean | true（true：新属性添加到初始位置，false：新属性出现在结尾） |

### appendOperate 属性

| 参数       | 说明        | 类型        | 默认值(示例)                                              |
| ---------- | ----------- | ----------- | --------------------------------------------------------- |
| key        | 唯一标识    | string      | -                                                         |
| title      | tooltip     | string      | 原生 title                                                |
| className  | 容器 class  | string      | -                                                         |
| render     | render 函数 | Function    | 见 vue 渲染函数                                           |
| clickEvent | 点击事件    | ()=>Promise | 可返回{type, value}, 将会改变当前 node 节点值，也可以不返回 |

### 事件

| 方法名 | 说明      | 参数           |
| ------ | --------- | -------------- |
| change | json 变化 | 当前 json 数据 |

### slot

| 名称        | 说明                                           |
| ----------- | ---------------------------------------------- |
| type-switch | 数据类型切换插槽                               |
| node-value  | 当前节点插槽（自定义类型，需要自定义插槽渲染） |
