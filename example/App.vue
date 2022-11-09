<template>
  <div class="json-warper">
    <SimpleJson :json="jsonData" />
  </div>
</template>
<script setup lang="tsx">
import SimpleJson from '../package/index';
import { jsonData } from './data';
import '../package/style/index.less';

// const handleClick = (nodeValue, allowType) => {
//   nodeValue.type = 'date';
// };
</script>
<style lang="less" scoped></style>
