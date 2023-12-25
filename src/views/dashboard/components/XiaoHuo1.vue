<template>
  <div class="XiaoHuoOne">
    <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址</el-checkbox>
    <el-checkbox v-model="isToy" @change="changeSettings">玩具类</el-checkbox>
    <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox>
  </div>
</template>

<script>

export default {
  name: 'XiaoHuoOne',
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
      if (newVal === true) {
        // console.log(true)
        this.YuChiCount(this.weight) < 10000 ? this.newTotalPrice += 50 : this.newTotalPrice += 30
      } else {
        // console.log(false)
        this.YuChiCount(this.weight) < 10000 ? this.newTotalPrice -= 50 : this.newTotalPrice -= 30
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
    },
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.YuChiCount(this.weight) / 1000
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += (2 * weight)
      } else {
        console.log(false)
        this.newTotalPrice -= (2 * weight)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    Magnetized: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.YuChiCount(this.weight) / 1000
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += (2 * weight)
      } else {
        console.log(false)
        this.newTotalPrice -= (2 * weight)
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

    YuChiCount(weight) {
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

    PriceForXiaoDai1(value, weight, LWH_arr) {
      const { FWeight, CWeight, FWeightPrice, CWeightPrice, channelCode } = value
      let totalPrice = 0
      if (channelCode === '小货包税2') {
        if (LWH_arr[0] >= 61 || LWH_arr[1] >= 45 || LWH_arr[2] >= 45) {
          return {
            totalPrice: 0,
            isShow: false,
            msg: '最长边<61cm, 宽高<46cm方可'
          }
        }
      }
      const pre = 30 // 私人地址 + 30
      const toy = 2 * this.YuChiCount(weight) / 1000 // 玩具类 2元/KG
      const Magnetized = 2 * this.YuChiCount(weight) / 1000 // 带磁 2元/KG
      totalPrice = (((this.YuChiCount(weight) - FWeight) / CWeight) * CWeightPrice) + FWeightPrice + pre + toy + Magnetized
      // 私人地址不足10KG的, 需要加20
      if (this.YuChiCount(weight) < 10000) {
        totalPrice += 20
      }
      this.$emit('countPrice', { totalPrice, isShow: true, msg: '' }, this.index)
      return { totalPrice, isShow: true, msg: '' }
    }
  }

}

</script>
