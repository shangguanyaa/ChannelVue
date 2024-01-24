<template>
  <div>
    <el-drawer
      ref="drawer"
      title="添加渠道"
      :before-close="handleClose"
      :visible.sync="is_add_open"
      :size="500"
      direction="rtl"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <el-form ref="form" :model="rowData" label-width="100px">
          <el-form-item label="渠道名称">
            <el-input v-model="rowData.channelName" placeholder="渠道名称" />
          </el-form-item>
          <el-form-item label="渠道代码">
            <el-input v-model="rowData.channelCode" placeholder="此代码为唯一的,不能和其他渠道相同" />
          </el-form-item>
          <el-form-item label="目的国家">
            <el-input v-model="rowData.country" type="textarea" placeholder="支持的国家, 使用逗号分隔" />
          </el-form-item>
          <el-form-item label="渠道类型">
            <el-input v-model="rowData.channelType" placeholder="渠道类型" />
          </el-form-item>
          <el-form-item label="支持类型">
            <el-checkbox :checked="ele1" @change="chick1">普货</el-checkbox>
            <el-checkbox :checked="ele2" @change="chick2">纯电</el-checkbox>
            <el-checkbox :checked="ele3" @change="chick3">带电带磁</el-checkbox>
          </el-form-item>
          <el-form-item label="尺寸限制">
            <el-col :span="1">
              长:
            </el-col>
            <el-col :span="6">
              <el-input v-model="rowData.long" placeholder="长" type="Number" />
            </el-col>
            <el-col :span="1">
              <el-divider direction="vertical" />
            </el-col>
            <el-col :span="1">
              宽:
            </el-col>
            <el-col :span="6">
              <el-input v-model="rowData.wide" placeholder="宽" type="Number" />
            </el-col>
            <el-col :span="1">
              <el-divider direction="vertical" />
            </el-col>
            <el-col :span="1">
              高:
            </el-col>
            <el-col :span="6">
              <el-input v-model="rowData.high" placeholder="高" type="Number" />
            </el-col>
          </el-form-item>
          <el-form-item label="最长边长">
            <el-input v-model="rowData.maxSidelength" type="Number" />
          </el-form-item>
          <el-form-item label="最大周长">
            <el-input v-model="rowData.volume" type="Number" />
          </el-form-item>
          <el-form-item label="最大重量">
            <el-input v-model="rowData.maxWeight" type="Number" placeholder="长 + (宽 + 高) * 2" />
          </el-form-item>
          <el-form-item label="进阶单位">
            <el-radio-group v-model="rowData.AdvancedUnits">
              <el-radio :label="500">0.5 KG  </el-radio>
              <el-radio :label="1000">1 KG</el-radio>
              <el-radio :label="0">不进阶</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计费重单位">
            <el-input v-model="rowData.volumeWight" type="Number" placeholder="该渠道重量进阶单位" />
          </el-form-item>
          <el-form-item label="配送时效">
            <el-input v-model="rowData.ageing" type="text" />
          </el-form-item>
          <el-form-item label="操作费">
            <el-input v-model="rowData.operatePrice" type="Number" />
          </el-form-item>
          <el-form-item label="挂号费">
            <el-input v-model="rowData.registerPrice" type="Number" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="rowData.remark" type="textarea" placeholder="备注" />
          </el-form-item>
          <el-form-item label="计算方式">
            <el-radio-group v-model="rowData.countWay">
              <el-radio :label="'1'">首重续重</el-radio>
              <el-radio :label="'2'">重量范围</el-radio>
              <br>
              <el-radio :label="'3'">重量对应价格</el-radio>
              <el-radio :label="'4'">直接计算</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="rowData.countWay === '1'">
            <div class="range-title">
              <span style="font-size: 20px;">首重续重参数设置</span>
            </div>
            <el-form-item label="首重重量">
              <el-col :span="8">
                <el-input v-model="rowData.FWeight" placeholder="长" />
              </el-col>
              <el-col :span="6" class="price-col">
                首重价格：
              </el-col>
              <el-col :span="8" class="price-col">
                <el-input v-model="rowData.FWeightPrice" placeholder="长" />
              </el-col>
            </el-form-item>
            <el-form-item label="续重重量">
              <el-col :span="8">
                <el-input v-model="rowData.CWeight" placeholder="长" />
              </el-col>
              <el-col :span="6" class="price-col">
                续重价格：
              </el-col>
              <el-col :span="8" class="price-col">
                <el-input v-model="rowData.CWeightPrice" placeholder="长" />
              </el-col>
            </el-form-item>
          </template>
          <template v-if="rowData.countWay === '2'">
            <div class="range-title">
              <span style="font-size: 20px;">范围设置</span>
            </div>
            <div class="range-title">
              <el-button size="mini" round @click="addOperate">添加操作费</el-button>
              <el-button size="mini" round @click="deleteOperate">去除操作费</el-button>
            </div>
            <el-form-item v-for="(item, i) in rowData.range" :key="i" :label="'范围 ' + (i + 1)">
              <div class="range-item">
                <el-input v-model="item.range[0]" type="Number" placeholder="起始重量" />
                <span> ~ </span>
                <el-input v-model="item.range[1]" type="Number" placeholder="结束重量" />
                <el-divider direction="vertical" />
                <el-input v-model="item.price" type="Number" placeholder="该范围价格" />
                <template v-if="item.operate !== undefined">
                  <el-divider direction="vertical" />
                  <el-input v-model="item.operate" type="Number" placeholder="操作费" />
                </template>
                <i v-show="i > 0" class="el-icon-remove-outline" @click="removeRange(i)" />
              </div>
            </el-form-item>
            <div class="add-icon" @click="addRange"><i class="el-icon-circle-plus-outline" /></div>
          </template>
          <template v-if="rowData.countWay === '3'">
            <div class="range-title">
              <span style="font-size: 20px;">范围设置</span>
            </div>
            <el-form-item v-for="(item, i) in rowData.range" :key="i" :label="'范围 ' + (i + 1)">
              <div class="range-item">
                <el-input v-model="item.range" type="Number" placeholder="重量" />
                <el-divider direction="vertical" />
                <el-input v-model="item.price" type="Number" placeholder="价格" />
                <i v-show="i > 0" class="el-icon-remove-outline" @click="removeRange(i)" />
              </div>
            </el-form-item>
            <div class="add-icon" @click="addRangePrice"><i class="el-icon-circle-plus-outline" /></div>
          </template>
          <template v-if="rowData.countWay === '4'">
            <div class="range-title">
              <span style="font-size: 20px;">直接计算参数设置</span>
            </div>
            <el-form-item label="价格">
              <el-input v-model="rowData.FWeightPrice" placeholder="每KG价格" />
            </el-form-item>
          </template>
          <el-form-item>
            <el-button type="primary" :loading="onLoading" @click="onSubmit">新增</el-button>
            <el-button @click="doLogRowData">开发调试按钮</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-drawer>
  </div>
</template>

<script>

export default {
  name: 'ChannelAdd',
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    is_add_open: {
      type: Boolean,
      default: () => { false }
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rowData: {
        channelName: '',
        channelCode: '',
        channelType: '',
        AdvancedUnits: 1000,
        country: '',
        long: 99999,
        wide: 99999,
        high: 99999,
        maxSidelength: 99999,
        maxWeight: 99999999,
        countWay: '1',
        FWeight: null,
        FWeightPrice: null,
        CWeight: null,
        CWeightPrice: null,
        range: null,
        ageing: '6-10天',
        volumeWight: 6000,
        operatePrice: 0,
        remark: null,
        volume: 99999,
        registerPrice: 0
      },
      withEle: [],
      ele1: false,
      ele2: false,
      ele3: false,
      onLoading: false
    }
  },
  watch: {
    'rowData.countWay': function(newVal, oldVal) {
      if (oldVal === '3' && newVal === '2') {
        this.rowData.range = []
      }
      if (oldVal === '2' && newVal === '3') {
        this.rowData.range = []
      }
    }
  },
  methods: {
    deleteOperate() {
      const range = this.rowData.range
      for (const item of range) {
        delete item.operate
      }
      this.$set(this.rowData, 'ragne', range)
      console.log(this.rowData.range)
      this.$forceUpdate()
    },
    addOperate() {
      const range = this.rowData.range
      if (!range || range.length === 0) {
        this.$message({
          type: 'warning',
          message: '请添加至少一个范围'
        })
        return
      }
      for (const item of range) {
        item.operate = null
      }
      this.$set(this.rowData, 'ragne', range)
      // this.rowData.range = range
      console.log(this.rowData.range)
      this.$forceUpdate()
    },
    chick1(val) {
      this.chickCheck(val, 1)
    },
    chick2(val) {
      this.chickCheck(val, 2)
    },
    chick3(val) {
      this.chickCheck(val, 3)
    },
    chickCheck(val, index) {
      if (val) {
        this.withEle.push(`${index}`)
      } else {
        this.withEle.splice(this.withEle.indexOf(`${index}`), 1)
      }
      console.log(this.withEle)
      this.initCheckBoxs()
    },
    initCheckBoxs() {
      for (const item of this.withEle) {
        switch (item) {
          case '1':
            this.ele1 = true
            break
          case '2':
            this.ele2 = true
            break
          case '3':
            this.ele3 = true
            break
          default:
            break
        }
      }
    },
    initRowData() {
      this.rowData = {
        channelName: '',
        channelCode: '',
        channelType: '',
        AdvancedUnits: 1000,
        country: '',
        long: 99999,
        wide: 99999,
        high: 99999,
        maxSidelength: 99999,
        maxWeight: 99999999,
        countWay: '1',
        FWeight: null,
        FWeightPrice: null,
        CWeight: null,
        CWeightPrice: null,
        range: null,
        ageing: '6-10天',
        volumeWight: 6000,
        operatePrice: 0,
        remark: null,
        volume: 99999,
        registerPrice: 0
      }
    },
    handleClose() {
      this.$emit('closeAdd')
      this.initRowData()
    },
    async handleUndateChannel() {
      this.onLoading = true

      this.rowData.withElectricity = this.withEle.toString()
      if (this.rowData.countWay === '1' || this.rowData.countWay === '4') {
        this.rowData.range = null
      } else if (this.rowData.countWay === '2' || this.rowData.countWay === '3') {
        this.rowData.FWeight = null
        this.rowData.FWeightPrice = null
        this.rowData.CWeight = null
        this.rowData.CWeight = null
      }
      // const data = this.rowData
      const res = await this.$store.dispatch('channel/insertChannel', { rowData: this.rowData })
      console.log(res)
      if (res.code === 200) {
        this.handleClose()
        this.$emit('updateSuccess')
      }
      this.onLoading = false
    },
    onSubmit() {
      console.log(this.rowData.FWeightPrice)
      if (!this.rowData.channelName) {
        this.$message({
          type: 'warning',
          message: '请输入渠道名称'
        })
      }
      if (!this.rowData.channelCode) {
        this.$message({
          type: 'warning',
          message: '请输入渠道代码: 谨慎修改此项'
        })
      }
      if (!this.rowData.channelType) {
        this.$message({
          type: 'warning',
          message: '请输入渠道类型'
        })
      }
      if (this.rowData.countWay === '1') {
        if (!this.rowData.FWeight || !this.rowData.FWeightPrice || !this.rowData.CWeight || !this.rowData.CWeightPrice) {
          this.$message({
            type: 'warning',
            message: '请完善首重续重数据'
          })
          return
        }
      }
      if (this.rowData.countWay === '2') {
        for (const item of this.rowData.range) {
          if (!item.price || !item.range[0] || !item.range[1]) {
            this.$message({
              type: 'warning',
              message: '请完善重量范围数据'
            })
            return
          }
        }
      }
      if (this.rowData.countWay === '4') {
        if (!this.rowData.FWeightPrice) {
          this.$message({
            type: 'warning',
            message: '请完善价格数据'
          })
          return
        }
      }
      this.handleUndateChannel()
    },
    addRange() {
      if (!this.rowData.range) {
        this.rowData.range = []
      }
      this.rowData.range.push({
        price: null,
        range: [null, null]
      })
    },
    addRangePrice() {
      if (!this.rowData.range) {
        this.rowData.range = []
      }
      this.rowData.range.push({
        range: null,
        price: null
      })
    },
    removeRange(index) {
      this.rowData.range.splice(index, 1)
    },
    doLogRowData() {
      console.log(this.rowData)
    }
  }
}
</script>

<style>
.el-drawer__body {
  overflow-y: auto !important;
}
.scrollbar-box::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
  border-radius: 2px;
}
.scrollbar-box::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  width: 4px;
  height: 80px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
}
.scrollbar-box::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}
.price-col {
  text-align: right;
}
</style>

<style scoped>
:deep(.el-drawer__body)  {
  overflow-y: auto !important;
}
.demo-drawer__content {
  padding: 0 20px;
}
.range-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.range-item>>>span {
  display: block;
  margin:0 6px;
}
.el-input>>>.el-input__inner {
  padding: 0 6px !important;
}
.range-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 0 20px 0;
  font-family: '微软雅黑';
}
.add-icon {
  text-align: center;
  color: rgb(35, 142, 241);
  font-size: 24px;
  margin-bottom: 20px;
}
.el-icon-remove-outline {
  font-size: 20px;
  margin-left: 6px;
  color: rgb(35, 142, 241);
}
</style>
