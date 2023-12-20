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
    index: { type: Number }
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
      this.$emit('countPrice', this.newTotalPrice, this.index)
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
      this.$emit('countPrice', this.newTotalPrice, this.index)
    }
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
    }
  }
}

</script>
