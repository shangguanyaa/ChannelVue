<template>
  <div class="XiaoHuoOne">
    <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址 {{ item.showInfo.CountWeight / 1000 > 30 ? item.showInfo.CountWeight / 1000 * 1 : 30 }} 元</el-checkbox>
    <el-checkbox v-model="isToy" @change="changeSettings">电子玩具类 1 元/KG</el-checkbox>
    <el-checkbox v-model="DPDJ" @change="changeSettings">单票单件 100 元</el-checkbox>
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox> -->
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
  </div>
</template>

<script>

import Descriptions from './descriptions.vue'

export default {
  name: 'UPS',
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
    privateAddress: true,
    isToy: true,
    DPDJ: true,
    newTotalPrice: 0
  }),
  watch: {
    privateAddress: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const msg = this.item.showInfo.msg
      const weight = this.item.showInfo.CountWeight
      if (newVal === true) {
        this.newTotalPrice += weight / 1000 > 30 ? weight / 1000 * 1 : 30
        msg.push(`私人地址: ${weight / 1000 > 30 ? weight / 1000 * 1 : 30} 元`)
      } else {
        this.newTotalPrice -= weight / 1000 > 30 ? weight / 1000 * 1 : 30
        msg.splice(msg.indexOf(`私人地址: ${weight / 1000 > 30 ? weight / 1000 * 1 : 30} 元`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
    },
    DPDJ: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 100
        msg.push(`单票单件: 100 元`)
      } else {
        this.newTotalPrice -= 100
        msg.splice(msg.indexOf(`单票单件: 100 元`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
    },
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const msg = this.item.showInfo.msg
      const weight = this.item.showInfo.CountWeight / 1000
      if (newVal === true) {
        this.newTotalPrice += (1 * weight)
        msg.push(`电子玩具类 1 元/KG: ${1 * weight} 元`)
      } else {
        this.newTotalPrice -= (1 * weight)
        msg.splice(msg.indexOf(`电子玩具类 1 元/KG: ${1 * weight} 元`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
    }
  },
  mounted() {
    this.forUPSPrice(this.item, this.lwh_arr, this.volume)
  },
  methods: {
    changeSettings() {

    },
    // 计算 UPS双清专线A价普货 渠道的重量, 不足1KG, 按照1KG计算
    forUPSWeight(val) {
      // 不足 21KG 的, 按照 21KG 计算
      val = val <= 21000 ? 21000 : val
      // 向上取整 Math.ceil
      return Math.ceil(val / 1000) * 1000
    },

    forUPSPrice(value, LWH_arr, volume) {
      // const { range } = value
      console.log('触发了初始化计算价格')
      const price = parseFloat(value.showInfo.totalPrice)
      const weight = value.showInfo.CountWeight
      const msg = value.showInfo.msg

      let ChaoZhong = 0
      if (weight / 1000 > 30 && weight / 1000 < 39) {
        ChaoZhong += 160
        msg.push('重量大于30KG小于39KG: 160元')
      }
      if (LWH_arr.length === 3 && (LWH_arr[0] >= 100 || LWH_arr[1] >= 76)) {
        ChaoZhong += 160
        msg.push('最长边 > 100 CM 或 第二边 > = 76 CM: 160元')
      }
      if (weight / 1000 >= 39 || volume > 300) {
        ChaoZhong += 650
        msg.push('重量超过 39 KG / 周长超过 300 CM < 399CM : 650元')
      }

      const toy = 1 * weight / 1000 // 电子玩具类 + 1 元/KG
      const DPDJ = 100 // 电子玩具类 + 1 元/KG
      const pre = weight / 1000 > 30 ? weight / 1000 * 1 : 30 // 私人地址 30 元

      msg.push(`私人地址: ${weight / 1000 > 30 ? weight / 1000 * 1 : 30} 元`)
      msg.push(`电子玩具类 1 元/KG: ${1 * weight / 1000} 元`)
      msg.push(`单票单件: 100 元`)
      const totalPrice = (price + toy + pre + ChaoZhong + DPDJ).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight: weight }, this.index, 'UPS.vue')
    }
  }
}

</script>
