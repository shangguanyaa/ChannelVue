<template>
  <div>
    <div v-if="channelLists.length === 0" class="no-data">
      <h2>暂无数据</h2>
    </div>
    <template v-else>
      <div v-for="(item, i) in channelLists" :key="item.channelID + i" class="item-channel">
        <el-card v-if="item.showInfo.isShow" class="box-card">
          <div slot="header" class="clearfix">
            <div class="title-left">
              <span class="channel-icon" :style="{ 'background-color': iconColor[item.channelCode] }" />
              <span>{{ item.channelName }}</span>
            </div>
            <div class="total-price">￥ {{ item.showInfo.totalPrice }}</div>
          </div>
          <el-collapse class="item-collapse">
            <el-collapse-item>
              <template slot="title">打开更多该渠道设置<i class="header-icon el-icon-info" /></template>
              <XiaoHuoOne
                v-if="(item.channelCode === '小货包税1' || item.channelCode === '小货包税2')"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <UPS v-if="item.channelCode === 'UPS'" :item="item" :index="i" v-bind="$attrs" @countPrice="countPrice" />
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </template>
  </div>
</template>

<script>
import { iconColor } from '@/utils/channelIcon'
import XiaoHuoOne from './components/XiaoHuo1'
import UPS from './components/UPS'

export default {
  name: 'ChannelList',
  components: { XiaoHuoOne, UPS },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    list: { type: Array }
  },
  data: () => ({
    channelLists: [],
    iconColor
  }),
  watch: {
    list: function(newVal) {
      this.channelLists = [...newVal]
    }
  },
  mounted() {
    this.channelLists = [...this._props.list]
  },
  methods: {
    countPrice(TotalPrice, index) {
      console.log(TotalPrice, index)
      this.channelLists[index].showInfo.totalPrice = TotalPrice
      console.log(this.list === this.channelLists)
      console.log(this.list)
    }
  }
}

</script>

<style scoped>
.item-channel {
  margin-top: 16px;
}

.item-collapse {
  width: 100%;
}

.clearfix {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: red;
  font-family: '微软雅黑';
}

.no-data {
  width: 100%;
  padding: 20px 0;
  text-align: center;
  letter-spacing: 3px;
  opacity: 0.5;
}

.el-card>>>.el-card__body {
  padding: 0 20px;
}

.title-left {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.channel-icon {
  display: block;
  width: 5px;
  height: 100%;
  margin-right: 6px;
}
</style>
