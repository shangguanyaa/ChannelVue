<!--
 * @Author: shangguanyaa 1051158791@qq.com
 * @Date: 2024-01-05 15:18:59
 * @LastEditors: shangguanyaa 1051158791@qq.com
 * @LastEditTime: 2024-1-8 15:48:27
 * @FilePath: \vue-admin-template\src\views\dashboard\components\LiChuang.vue
 * @Description: 渠道: 宇驰-欧洲小货双清包税专线【后端UPS派送】
-->
<template>
  <div class="XiaoHuoOne">
    <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址 30 元</el-checkbox>
    <el-checkbox v-model="isToy" @change="changeSettings">玩具类 2 元/KG</el-checkbox>
    <el-checkbox v-model="Magnetized" @change="changeSettings">带磁 2 元/KG</el-checkbox>
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
  name: 'XiaoHuoOne',
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
    Magnetized: true,
    newTotalPrice: 0,
    showInfo: {}
  }),
  watch: {
    weight: function(newVal) {
      console.log(newVal)
    },
    privateAddress: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 30
        msg.push(`私人地址: 30 元`)
      } else {
        this.newTotalPrice -= 30
        msg.splice(msg.indexOf(`私人地址: 30 元`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
    },
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const msg = this.item.showInfo.msg
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      if (newVal === true) {
        this.newTotalPrice += (2 * CountWeight)
        msg.push(`玩具类 2 元/KG: ${CountWeight * 2} 元`)
      } else {
        this.newTotalPrice -= (2 * CountWeight)
        msg.splice(msg.indexOf(`玩具类 2 元/KG: ${CountWeight * 2} 元`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    Magnetized: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const msg = this.item.showInfo.msg
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      if (newVal === true) {
        this.newTotalPrice += (2 * CountWeight)
        msg.push(`带磁 2 元/KG: ${CountWeight * 2} 元`)
      } else {
        this.newTotalPrice -= (2 * CountWeight)
        msg.splice(msg.indexOf(`带磁 2 元/KG: ${CountWeight * 2} 元`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    }
  },
  mounted() {
    this.PriceForXiaoDai1(this.item, this.weight, this.lwh_arr)
  },
  methods: {
    changeSettings() {
    },
    isInteger(obj) {
      return obj % 1 === 0
    },
    halfWeight(weight) {
      let currentScore = 0
      const floor = Math.floor((weight / 1000))
      if (this.isInteger(weight / 1000)) {
        currentScore = weight
        return currentScore
      }
      if (floor + 0.5 < (weight / 1000)) {
        currentScore = (floor + 1) * 1000
        return currentScore
      } else {
        currentScore = (floor + 0.5) * 1000
        return currentScore
      }
    },

    YuChiCount(weight, AdvancedUnits, volumeWight, LWH_arr) {
      let currentScore = 0
      let currentWeight = 0
      let VWight = 0
      if (LWH_arr.length !== 3) {
        VWight = 0
      } else {
        VWight = ((LWH_arr[0] * LWH_arr[1] * LWH_arr[2]) / volumeWight * 1000).toFixed(2)
        if (VWight < 20000) {
          VWight = this.halfWeight(VWight)
        } else {
          VWight = Math.ceil(VWight / 1000) * 1000
        }
      }
      if (AdvancedUnits === 500) {
        currentWeight = this.halfWeight(weight)
      } else {
        currentWeight = Math.ceil(weight / 1000) * 1000
      }
      currentScore = currentWeight > VWight ? currentWeight : VWight
      return currentScore
    },

    PriceForXiaoDai1(value, weight, LWH_arr) {
      const { channelCode, showInfo } = value

      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = Number(showInfo.CountWeight)
      const msg = showInfo.msg

      let totalPrice = 0
      if (channelCode === '小货包税2') {
        if (LWH_arr[0] >= 61 || LWH_arr[1] >= 45 || LWH_arr[2] >= 45) {
          return {
            totalPrice: 0,
            isShow: false,
            msg: ['最长边<61cm, 宽高<46cm方可']
          }
        }
      }
      const pre = 30 // 私人地址 + 30
      const toy = 2 * CountWeight / 1000 // 玩具类 2元/KG
      const Magnetized = 2 * CountWeight / 1000 // 带磁 2元/KG

      msg.push(`私人地址: 30 元`)
      msg.push(`玩具类 2 元/KG: ${CountWeight * 2} 元`)
      msg.push(`带磁 2 元/KG: ${CountWeight * 2} 元`)

      totalPrice = price + pre + toy + Magnetized

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'XiaoHuo1.vue')
      return { totalPrice, isShow: true, msg: '' }
    }
  }

}

</script>
