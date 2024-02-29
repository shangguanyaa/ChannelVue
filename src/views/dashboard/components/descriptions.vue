<template>
  <div class="more">
    <el-descriptions title="渠道信息" :column="3" border>
      <el-descriptions-item label="渠道名称" label-class-name="my-label" content-class-name="my-content">
        {{ item.channelName || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="渠道类型">{{ item.channelType || '-' }}</el-descriptions-item>
      <el-descriptions-item label="计费重量">{{ item.showInfo.CountWeight }} G</el-descriptions-item>
      <el-descriptions-item label="其他附加费用">
        <p v-for="(msg, i) in item.showInfo.msg" :key="i">
          {{ msg }}
        </p>
      </el-descriptions-item>
      <el-descriptions-item label="原价">
        {{ item.showInfo.price }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" :content-style="{ 'text-align': 'left', 'max-width': '290px' }">
        {{ item.remark || '无备注' }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" :content-style="{ 'text-align': 'left', 'max-width': '290px' }">
        {{ item.remark || '无备注' }}
      </el-descriptions-item>
      <!-- <el-descriptions-item label="原价">{{ item.showInfo.price }} G</el-descriptions-item> -->
    </el-descriptions>
  </div>
</template>

<script>

export default {
  name: 'Descriptions',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}

</script>
