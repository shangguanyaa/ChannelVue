<!--
 * @Author: shangguanyaa 1051158791@qq.com
 * @Date: 2024-01-05 15:18:59
 * @LastEditors: shangguanyaa 1051158791@qq.com
 * @LastEditTime: 2024-01-05 16:33:40
 * @FilePath: \vue-admin-template\src\views\dashboard\components\LiChuang.vue
 * @Description:
-->
<template>
  <div class="more">
    <!-- <el-descriptions title="渠道信息" :column="3" border>
      <el-descriptions-item label="渠道名称" label-class-name="my-label" content-class-name="my-content">
        {{ item.channelName || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="渠道类型">{{ item.channelType || '-' }}</el-descriptions-item>
      <el-descriptions-item label="配送时效">{{ item.ageing || '-' }}</el-descriptions-item>
      <el-descriptions-item label="其他附加费用">
        <p v-for="(msg, i) in item.showInfo.msg" :key="i">
          {{ msg }}
        </p>
      </el-descriptions-item>
      <el-descriptions-item label="备注" :content-style="{ 'text-align': 'left' }">
        {{ item.remark || '无备注' }}
      </el-descriptions-item>
    </el-descriptions> -->
    <Descriptions :item="item" />
    <!-- <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址</el-checkbox>
    <el-checkbox v-model="isToy" @change="changeSettings">电子玩具类</el-checkbox> -->
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox> -->
  </div>
</template>

<script>
import Descriptions from './descriptions.vue'

export default {
  name: 'LiChuang',
  components: { Descriptions },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    item: { type: Object },
    // eslint-disable-next-line vue/require-default-prop
    weight: { type: Number },
    // eslint-disable-next-line vue/require-default-prop
    index: { type: Number },
    // eslint-disable-next-line vue/prop-name-casing
    lwh_arr: {
      type: Array,
      default: () => { [] }
    },
    volume: {
      type: Number,
      default: () => { 0 }
    }
  },
  data: () => ({
    // privateAddress: true,
    // isToy: true,
    newTotalPrice: 0
  }),
  watch: {
    // isToy: function(newVal) {
    //   this.newTotalPrice = this.item.showInfo.totalPrice
    //   const weight = this.item.showInfo.CountWeight / 1000
    //   if (newVal === true) {
    //     console.log(true)
    //     this.newTotalPrice += (1 * weight)
    //   } else {
    //     console.log(false)
    //     this.newTotalPrice -= (1 * weight)
    //   }
    //   this.item.showInfo.totalPrice = this.newTotalPrice
    //   // this.$emit('countPrice', this.newTotalPrice, this.index)
    // }
  },
  mounted() {
    this.forUPSPrice(this.item)
  },
  methods: {
    changeSettings() {

    },

    forUPSPrice(value) {
      const { showInfo, channelCode } = value
      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = showInfo.CountWeight
      const msg = showInfo.msg

      let ChaoZhong = 0
      if (channelCode === '力创欧洲空派超大') {
        if (CountWeight < 100000) {
          ChaoZhong += 500
          msg.push('空派重量在 100 KG 以内: 500元')
        }
        if (CountWeight >= 100000) {
          ChaoZhong += 200
          msg.push('空派重量在 100 KG 以上: 200元')
        }
      } else {
        ChaoZhong += 500
        msg.push('海派超大件费用: 500元')
      }

      const totalPrice = (price + ChaoZhong).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'LiChauang.vue')
    }
  }
}

</script>

<style scoped>

</style>
