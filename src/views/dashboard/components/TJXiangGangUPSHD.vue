<!--
 * @Author: shangguanyaa 1051158791@qq.com
 * @Date: 2024-01-05 15:18:59
 * @LastEditors: shangguanyaa 1051158791@qq.com
 * @LastEditTime: 2024-1-8 15:48:27
 * @FilePath: \vue-admin-template\src\views\dashboard\components\LiChuang.vue
 * @Description: 渠道: 泰嘉-香港UPS红单 8000
-->
<template>
  <div class="more">
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">弱磁</el-checkbox> -->
    <el-checkbox v-model="GuanShui" @change="changeSettings">关税预付 150 元/票</el-checkbox>
    <Descriptions :item="item" />
  </div>
</template>

<script>

import Descriptions from './descriptions.vue'

export default {
  name: 'TJXiangGangUPSHD',
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
    GuanShui: false,
    newTotalPrice: 0
  }),
  watch: {
    GuanShui: function(newVal) {
      // 关税预付: 手续费 150 元/票
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 150
        msg.push('关税预付手续费: 150 元/票')
      } else {
        this.newTotalPrice -= 150
        msg.splice(msg.indexOf('关税预付手续费: 150 元/票'), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    }
  },
  mounted() {
    this.forUPSPrice(this.item, this.volume)
  },
  methods: {
    changeSettings() {

    },

    forUPSPrice(value, volume) {
      const { showInfo } = value
      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = Number(showInfo.CountWeight)
      const msg = showInfo.msg

      const ChaoZhong = 0

      // 5、大包裹附加费：若包裹长度加周长 [(2 x 宽度) + (2 x 高度)] 超出290 厘米，但不超出 UPS 尺寸上限390厘米，即被视为「大型包裹」
      // 最低计费重40KG。加收附加费543元/件*燃油，当UPS向客户收取大型包裹附加费时，并不会同时收取附加手续服务费。

      // if (this.lwh_arr.length === 3 && (this.lwh_arr[0] >= 118 || this.lwh_arr[1] >= 74)) {
      //   ChaoZhong = 108
      //   msg.push('最长边 >= 118 CM / 第二边长 >= 74 CM: 108元')
      // }
      // // 或围长超264厘米
      // if (volume > 264) {
      //   ChaoZhong = 108
      //   msg.push('围长 > 264 CM: 108元')
      // }
      // // 超重附加费：单件结算重超30KG（包含30KG）
      // if (CountWeight / 1000 >= 30) {
      //   ChaoZhong = 108
      //   msg.push('单件结算重超30KG: 108元')
      // }

      // const ele = 25 // 弱磁 + 25 元

      // msg.push('弱磁: 25 元/票')

      const totalPrice = (price + ChaoZhong).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'TJXiangGangUPSHD.vue')
    }
  }
}

</script>

<style scoped>

</style>
