<template>
  <JsonNode :json="json" :currect-level="currectLevel">
    <template #sub-node="{ node }">
      <SubJsonNode
        v-for="item in node"
        :key="item.id"
        :json="item"
        :currect-level="currectLevel + 1"
      >
        <template #type-switch="{ nodeValue, allowType }">
          <slot
            name="type-switch"
            :allow-type="allowType"
            :node-value="nodeValue"
          />
        </template>
        <template #node-value="{ nodeValue, handleChange }">
          <slot
            name="node-value"
            :node-value="nodeValue"
            :handle-change="handleChange"
          />
        </template>
      </SubJsonNode>
    </template>
    <template #type-switch="{ nodeValue, allowType }">
      <slot
        name="type-switch"
        :allow-type="allowType"
        :node-value="nodeValue"
      />
    </template>
    <template #node-value="{ nodeValue, handleChange }">
      <slot
        name="node-value"
        :node-value="nodeValue"
        :handle-change="handleChange"
      />
    </template>
  </JsonNode>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import JsonNode from './JsonNode.vue';
import type { PropType } from 'vue';
import type { JsonItem } from './../type/simple-json';
export default defineComponent({
  name: 'SubJsonNode',
  components: { JsonNode },
  props: {
    json: {
      type: Object as PropType<JsonItem>,
      required: true,
    },
    currectLevel: {
      type: Number,
      default: 0,
    },
  },
});
</script>
