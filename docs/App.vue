<template>
  <div class="json-warper">
    <div class="color-select">
      <span v-for="(value, key) in keyCOlor" :key="key" class="color-options">
        <span>{{ key }}:</span>
        <input v-model="keyCOlor[key]" type="color" />
      </span>
    </div>
    <SimpleJson
      :json="json"
      :disabled="false"
      :extend-all="false"
      :extend-level="1"
      :config="config"
      @change="handleJsonChange"
    >
      <!-- <template #type-switch="{ nodeValue, allowType }">
        <span @click="handleClick(nodeValue, allowType)">切换</span>
      </template> -->
      <template #node-value="{ nodeValue }">
        <!-- 自定义类型 -->
        <input
          v-if="nodeValue.type === 'color'"
          v-model="nodeValue.value"
          class="input"
          type="color"
        />
        <input
          v-if="nodeValue.type === 'date'"
          v-model="nodeValue.value"
          type="Date"
        />
      </template>
    </SimpleJson>
  </div>
</template>
<script setup lang="tsx">
import { ref } from 'vue';
import { deepAnalysisJson, deepReductionJson } from '../package/index';
import { jsonData } from './data';
import type { Ref } from 'vue';
import type { JsonEditorConfig } from '../package/index';

const json = ref(deepAnalysisJson(jsonData));
const keyCOlor = ref({
  string: '#3490de',
  number: '#00b8a9',
  array: '#ffde7d',
  object: '#f6416c',
  boolean: '#a82ffc',
  date: '#3d84a8',
  color: '#e84545',
});
const config: Ref<JsonEditorConfig> = ref({
  keyColor: keyCOlor.value,
  allowType: [
    {
      type: 'boolean',
      desc: '布尔值',
    },
    {
      type: 'number',
      desc: '数字',
    },
    {
      type: 'string',
      desc: '字符串',
    },
    {
      type: 'array',
      desc: '数组',
    },
    {
      type: 'object',
      desc: '对象',
    },
    {
      type: 'color',
      desc: '颜色',
      default: '#94B49F',
      slot: true,
    },
    {
      type: 'date',
      desc: '时间',
      default: '2022-02-23',
      slot: true,
    },
  ],
  appendOperate: [
    // {
    //   key: 'custom',
    //   title: 'mock',
    //   className: 'json-custom-icon',
    //   text: 'mock',
    //   clickEvent: () => {
    //     return new Promise((resolve) =>
    //       resolve({
    //         type: 'color',
    //         value: '#65C18C',
    //       })
    //     );
    //   },
    // },
  ],
});
const handleJsonChange = (val: any) => {
  console.log(json.value);
  json.value = val;
  console.log(deepReductionJson(json.value));
};

// const handleClick = (nodeValue, allowType) => {
//   nodeValue.type = 'date';
// };
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
.color-select {
  margin-bottom: 20px;
  .color-options {
    margin-right: 10px;
  }
}
</style>
