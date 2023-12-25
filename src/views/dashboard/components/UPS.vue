<template>
  <div class="XiaoHuoOne">
    <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址</el-checkbox>
    <el-checkbox v-model="isToy" @change="changeSettings">电子玩具类</el-checkbox>
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox> -->
  </div>
</template>

<script>

export default {
  name: 'UPS',
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
    newTotalPrice: 0
  }),
  watch: {
    privateAddress: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += 30
      } else {
        console.log(false)
        this.newTotalPrice -= 30
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.forUPSWeight(this.weight) / 1000
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += (1 * weight)
      } else {
        console.log(false)
        this.newTotalPrice -= (1 * weight)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    }
  },
  mounted() {
    this.forUPSPrice(this.item, this.weight, this.lwh_arr, this.volume)
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

    forUPSPrice(value, weight, LWH_arr, volume) {
      const { range } = value
      let price = 0
      for (const item of range) {
        if (this.forUPSWeight(weight) >= item.range[0] && this.forUPSWeight(weight) < item.range[1]) {
          price = item.price
          break
        }
      }
      console.log(222)

      let ChaoZhong = 0
      if ((this.forUPSWeight(weight) > 30000 && this.forUPSWeight(weight) < 39000) || (LWH_arr.length === 3 && LWH_arr[0] >= 100 || LWH_arr[1] >= 76)) {
        ChaoZhong = 160
      }
      if (this.forUPSWeight(weight) >= 39000 || volume > 300) {
        ChaoZhong = (650 + 160)
      }

      console.log('超重', ChaoZhong)

      const toy = 1 // 电子玩具类 + 1
      const pre = 30 // 私人地址 30 元
      const totalPrice = (price * (this.forUPSWeight(weight) / 1000) + (toy * this.forUPSWeight(weight) / 1000) + pre + ChaoZhong).toFixed(2)
      console.log((toy * this.forUPSWeight(weight) / 1000))

      console.log({ totalPrice, isShow: true, msg: `超重费用: ${ChaoZhong}` })
      this.$emit('countPrice', { totalPrice, isShow: true, msg: `超重费用: ${ChaoZhong}` }, this.index)
      return { totalPrice, isShow: true, msg: `超重费用: ${ChaoZhong}` }
    }
  }
}

</script>
