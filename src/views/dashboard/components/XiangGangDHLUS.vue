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
    <el-checkbox v-model="PianYuan" @change="changeSettings">偏远</el-checkbox>
    <el-checkbox v-model="TeBieChuLi" @change="changeSettings">特别处理货件</el-checkbox>
    <el-descriptions title="渠道信息" :column="3" border>
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
      <el-descriptions-item label="备注" :content-style="{ 'text-align': 'left', 'max-width': '290px' }">
        {{ item.remark || '无备注' }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox> -->
  </div>
</template>

<script>

export default {
  name: 'XiangGangDHLUS',
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
    PianYuan: false,
    TeBieChuLi: false,
    newTotalPrice: 0
  }),
  watch: {
    PianYuan: function(newVal) {
      // 偏远附加费：目的地偏远地区附加费，收费标准为人民币5/KG*燃油，每票最低收费为人民币250元*燃油
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 5 >= 250 ? CountWeight * 5 : 250
        msg.push('偏远收费 5元/KG, 最低 250 元')
      } else {
        this.newTotalPrice -= CountWeight * 5 >= 250 ? CountWeight * 5 : 250
        msg.splice(msg.indexOf('偏远收费 5元/KG, 最低 250 元'), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    TeBieChuLi: function(newVal) {
      // RMB2000/件(需另加燃油附加费)
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 2000
        msg.push('特殊处理货件: 2000 元')
      } else {
        this.newTotalPrice -= 2000
        msg.splice(msg.indexOf('特殊处理货件: 2000 元'), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    }
  },
  mounted() {
    this.forUPSPrice(this.item, this.lwh_arr)
  },
  methods: {
    changeSettings() {

    },

    forUPSPrice(value, LWH_arr) {
      const { showInfo } = value
      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = Number(showInfo.CountWeight)

      let ChaoZhong = 0
      const msg = []

      if (LWH_arr.length === 3 && LWH_arr[0] >= 118) {
        ChaoZhong += 500
        msg.push('单件单边长度 >= 118 CM: 500元')
      }
      if (CountWeight >= 68000) {
        ChaoZhong += 900
        msg.push('重量 >= 68 KG: 900元')
      }

      const totalPrice = (price + ChaoZhong).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'XiangGangDHLUS.vue')
    }
  }
}

</script>

<style scoped>

</style>
