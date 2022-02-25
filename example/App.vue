<template>
  <div class="json-warper">
    <SimpleJson
      :json="json"
      :disabled="false"
      :extend-all="false"
      :extend-level="1"
      :config="config"
      @change="handleJsonChange"
    >
      <template #type-switch> </template>
      <template #node-value="{ nodeValue }">
        <input v-if="nodeValue.type === 'color'" v-model="nodeValue.value" class="input" type="color" />
        <input v-if="nodeValue.type === 'date'" v-model="nodeValue.value" type="Date" />
      </template>
    </SimpleJson>
  </div>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { deepAnalysisJson, deepReductionJson } from './../src';
import { jsonStr } from './data';
const json = ref(deepAnalysisJson(JSON.parse(jsonStr)));
const config = {
  keyColor: {
    string: '#f90',
    number: 'red',
    array: '#71aff1',
    object: '#19be6b',
    date: 'red',
    color: '#603601'
  },
  allowType: [
    {
      type: 'boolean',
      desc: '布尔值'
    },
    {
      type: 'number',
      desc: '数字'
    },
    {
      type: 'string',
      desc: '字符串'
    },
    {
      type: 'array',
      desc: '数组'
    },
    {
      type: 'date',
      desc: '时间',
      default: '2022-02-23',
      slot: true
    },
    {
      type: 'object',
      desc: '对象'
    },
    {
      type: 'color',
      desc: '颜色',
      default: '#94B49F',
      slot: true
    }
  ],
  appendOperate: [
    {
      key: 'custom',
      title: 'mock',
      className: 'json-custom-icon',
      text: 'mock',
      clickEvent: () => {
        return new Promise(resolve =>
          resolve({
            type: 'color',
            value: '#65C18C'
          })
        );
      }
    }
  ]
};
const handleJsonChange = (val: any) => {
  console.log(json.value);
  json.value = val;
  console.log(deepReductionJson(json.value));
};
</script>
<style lang="less" scoped>
.json-warper {
  padding: 40px;
}
.json-editor-example {
  padding: 0 40px;
}
:deep(.json-custom-icon) {
  margin-left: 5px;
  cursor: pointer;
  color: green;
}
.input {
  height: 20px;
}
</style>
