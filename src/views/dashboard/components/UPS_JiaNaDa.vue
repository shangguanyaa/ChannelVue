<template>
  <div class="XiaoHuoOne">
    <!-- <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址</el-checkbox> -->
    <el-checkbox v-model="isToy" @change="changeSettings">电子玩具类</el-checkbox>
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox> -->
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
      <el-descriptions-item label="备注" :content-style="{ 'text-align': 'left' }">
        {{ item.remark || '无备注' }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>

export default {
  name: 'UPSJiaNaDa',
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
        this.newTotalPrice += 30
      } else {
        this.newTotalPrice -= 30
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.item.showInfo.CountWeight / 1000
      if (newVal === true) {
        this.newTotalPrice += (3 * weight)
      } else {
        this.newTotalPrice -= (3 * weight)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
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
      val = val <= 11000 ? 11000 : val
      // 向上取整 Math.ceil
      return Math.ceil(val / 1000) * 1000
    },

    forUPSPrice(value, LWH_arr, volume) {
      const { showInfo } = value
      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = showInfo.CountWeight

      let ChaoZhong = 0
      const msg = []
      if ((CountWeight > 30000)) {
        ChaoZhong += 120
        msg.push('超重费用:120, ')
      }
      if (LWH_arr.length === 3 && LWH_arr[0] > 120) {
        ChaoZhong += 120
        msg.push('超长费用:120, ')
      }
      //  || (LWH_arr.length === 3 && LWH_arr[0] >= 100 || LWH_arr[1] >= 76)
      if (volume > 265 && volume < 400) {
        ChaoZhong += 420
        msg.push('大型货件:420')
      }

      console.log('msg: ')
      console.log(msg)

      const toy = 3 // 电子玩具类 + 3
      const pre = 0 // 私人地址 30 元
      const totalPrice = (price + (toy * CountWeight / 1000) + pre + ChaoZhong).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'UPS_JiaNaDa.vue')
    }
  }
}

</script>
