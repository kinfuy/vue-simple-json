<template>
  <JsonNode :json="json" :currect-level="currectLevel">
    <template #sub-node="{ node }">
      <SubJsonNode v-for="item in node" :key="item.id" :json="item" :currect-level="currectLevel + 1">
        <template #type-switch="{ nodeValue, allowType }">
          <slot name="type-switch" :allowType="allowType" :nodeValue="nodeValue"></slot>
        </template>
        <template #node-value="{ nodeValue, handleChange }">
          <slot name="node-value" :nodeValue="nodeValue" :handleChange="handleChange"></slot>
        </template>
      </SubJsonNode>
    </template>
    <template #type-switch="{ nodeValue, allowType }">
      <slot name="type-switch" :allowType="allowType" :nodeValue="nodeValue"></slot>
    </template>
    <template #node-value="{ nodeValue, handleChange }">
      <slot name="node-value" :nodeValue="nodeValue" :handleChange="handleChange"></slot>
    </template>
  </JsonNode>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { JsonItem } from './../type/simple-json';
import JsonNode from './JsonNode.vue';
export default defineComponent({
  name: 'SubJsonNode',
  components: { JsonNode },
  props: {
    json: {
      type: Object as PropType<JsonItem>,
      required: true
    },
    currectLevel: {
      type: Number,
      default: 0
    }
  }
});
</script>
<style lang="less" scoped></style>
