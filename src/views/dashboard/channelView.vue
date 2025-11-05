<template>
  <div>
    <div v-if="channelLists.length === 0" class="no-data">
      <h2>暂无数据</h2>
    </div>
    <template v-else>
      <div class="table_header">
        <el-row>
          <el-col :span="6">
            <p>渠道名</p>
          </el-col>
          <el-col :span="6">
            <p class="total-price">价格</p>
          </el-col>
          <el-col :span="6">
            <p>计费重量</p>
          </el-col>
          <el-col :span="3">
            <p class="ageing">配送时效</p>
          </el-col>
          <el-col :span="3">
            <p class="channelType">渠道类型</p>
          </el-col>
        </el-row>
      </div>
      <div v-for="(item, i) in channelLists" :key="i" class="item-channel">
        <el-card v-if="item.showInfo.isShow" class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="6">
                <div class="title-left">
                  <span class="channel-icon" :style="{ 'background-color': iconColor[item.channelType] }" />
                  <span>{{ item.channelName }}</span>
                </div>
              </el-col>
              <el-col :span="6">
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
              <el-col :span="6">
                <div class="title-left">
                  <span>计费重 {{ (item.showInfo.CountWeight / 1000).toFixed(2) }} KG</span>
                </div>
              </el-col>
              <el-col :span="3">
                <p class="ageing">{{ item.ageing }}</p>
              </el-col>
              <el-col :span="3">
                <p class="channelType">{{ item.channelType }}</p>
              </el-col>
            </el-row>
          </div>
          <el-collapse class="item-collapse">
            <el-collapse-item>
              <template slot="title">打开更多该渠道设置<i class="header-icon el-icon-info" /></template>
              <KeepAlive>
                <Info
                  :item="item"
                  :index="i"
                  v-bind="$attrs"
                  @countPrice="countPrice"
                />
              </KeepAlive>

              <!-- <XiaoHuoOne
                v-if="(item.channelCode === '小货包税1' || item.channelCode === '小货包税2')"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <UPS
                v-if="item.channelCode === 'UPS'"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <UPSJiaNaDa
                v-if="item.channelCode === '加拿大UPS包税'"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <HKUPS
                v-if="item.channelCode === 'HKUPS'"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <LiChuang
                v-if="['力创欧洲空派超大', '力创欧洲海派超大'].includes(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <XiangGangDHLUS
                v-if="['香港DHL_美国'].includes(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJShenZhenUPS
                v-if="['深圳UPS红单小货'].includes(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJShenZhenLianBang
                v-if="['泰嘉_深圳联邦'].includes(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJDHL6000
                v-if="['泰嘉-DHL6000专线'].includes(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJFedExIP
                v-if="['香港FedExIPPAK', '香港FededIP'].includes(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJDianChiUSA
                v-if="['电池-中美专线', '电池-中美专线(高重量)'].includes(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJDianChiFaGuo
                v-if="start(item.channelCode)"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJXiangGangXiaoHuo
                v-if="item.channelCode === '香港UPS小货价'"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              />
              <TJXiangGangUPSHD
                v-if="item.channelCode === '泰嘉-香港UPS红单'"
                :item="item"
                :index="i"
                v-bind="$attrs"
                @countPrice="countPrice"
              /> -->
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </template>
  </div>
</template>

<script>
import { iconColor } from '@/utils/channelIcon'
// import XiaoHuoOne from './components/XiaoHuo1'
// import UPS from './components/UPS'
// import UPSJiaNaDa from './components/UPS_JiaNaDa.vue'
// import HKUPS from './components/HKUPS.vue'
// import LiChuang from './components/LiChuang.vue'
// import XiangGangDHLUS from './components/XiangGangDHLUS.vue'
// import TJShenZhenUPS from './components/TJShenZhenUPS.vue'
// import TJShenZhenLianBang from './components/TJShenZhenLianBang.vue'
// import TJDHL6000 from './components/TJDHL6000.vue'
// import TJFedExIP from './components/TJFedExIP.vue'
// import TJDianChiUSA from './components/TJDianChiUSA.vue'
// import TJDianChiFaGuo from './components/TJDianChiFaGuo.vue'
// import TJXiangGangXiaoHuo from './components/TJXiangGangXiaoHuo.vue'
// import TJXiangGangUPSHD from './components/TJXiangGangUPSHD.vue'
import Info from './components/info.vue'

export default {
  name: 'ChannelList',
  components: {
    // XiaoHuoOne,
    // UPS,
    // UPSJiaNaDa,
    // HKUPS,
    // LiChuang,
    // XiangGangDHLUS,
    // TJShenZhenUPS,
    // TJShenZhenLianBang,
    // TJDHL6000,
    // TJFedExIP,
    // TJDianChiUSA,
    // TJDianChiFaGuo,
    // TJXiangGangXiaoHuo,
    // TJXiangGangUPSHD,
    Info
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
      // console.log('触发了父组件重置数据')
      // console.log(TotalPrice, index, from)
      this.channelLists[index].showInfo = TotalPrice
      this.$emit('countPrice')
    }
  }
}

</script>

<style scoped>

.table_header {
  padding: 0 20px;
  font-size: 18px;
  font-weight: bold;
}
.item-channel {
  margin-top: 16px;
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
  text-align: center;
}

.ageing {
  width: 100%;
  text-align: left;
}

.channelType {
  width: 100%;
  text-align: center;
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
