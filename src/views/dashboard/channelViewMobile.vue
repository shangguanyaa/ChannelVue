<template>
  <div>
    <div v-if="channelLists.length === 0" class="no-data">
      <h2>暂无数据</h2>
    </div>
    <template v-else>
      <div v-for="(item, i) in channelLists" :key="item.channelID + i" class="item-channel">
        <el-card v-if="item.showInfo.isShow" class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="16">
                <div class="title-left">
                  <span class="channel-icon" :style="{ 'background-color': iconColor[item.channelType] }" />
                  <span>{{ item.channelName }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <el-popover
                  placement="top-end"
                  title="附加费用"
                  width="200"
                  trigger="hover"
                >
                  <div v-for="(msg, index) in item.showInfo.msg" :key="index">
                    {{ msg }}
                  </div>
                  <div slot="reference" class="total-price">￥ {{ item.showInfo.totalPrice }}</div>
                </el-popover>
              </el-col>
            </el-row>
          </div>
          <el-collapse class="item-collapse">
            <el-collapse-item>
              <template slot="title">打开更多该渠道设置<i class="header-icon el-icon-info" /></template>
              <MobileInfo
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />

            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </template>
  </div>
</template>

<script>
import { iconColor } from '@/utils/channelIcon'
import MobileInfo from './components/mobileInfo.vue'

export default {
  name: 'ChannelListMobile',
  components: {
    MobileInfo
  },
  inheritAttrs: true,
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
    start(val) {
      const arr = [
        '电池-法国专线(1)',
        '电池-法国专线(2)',
        '电池-法国专线(3)',
        '电池-法国专线(4)',
        '电池-法国专线(5)',
        '电池-法国专线(6)',
        '电池-法国专线(7)',
        '电池-法国专线(8)',
        '电池-法国专线(9)'
      ]
      return arr.includes(val)
    },
    countPrice(TotalPrice, index, from) {
      console.log('触发了父组件重置数据')
      console.log(TotalPrice, index, from)
      this.channelLists[index].showInfo = TotalPrice
    }
  }
}

</script>

<style scoped>
h2 {
  font-size: 0.3rem;
}
.item-channel {
  margin-top: 16px;
  font-size: 0.16rem;
}

.item-collapse {
  width: 100%;
}

.clearfix {
  width: 100%;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: red;
  font-family: '微软雅黑';
  text-align: right;
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}
</style>
