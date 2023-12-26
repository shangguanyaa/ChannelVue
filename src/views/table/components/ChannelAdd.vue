<template>
  <div>
    <el-drawer
      ref="drawer"
      title="添加渠道"
      :before-close="handleClose"
      :visible.sync="is_add_open"
      direction="rtl"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <el-form ref="form" :model="rowData" label-width="80px">
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
          <el-form-item label="尺寸限制">
            <el-col :span="2">
              长:
            </el-col>
            <el-col :span="6">
              <el-input v-model="rowData.long" placeholder="长" type="Number" />
            </el-col>
            <el-col :span="2">
              宽:
            </el-col>
            <el-col :span="6">
              <el-input v-model="rowData.wide" placeholder="宽" type="Number" />
            </el-col>
            <el-col :span="2">
              高:
            </el-col>
            <el-col :span="6">
              <el-input v-model="rowData.high" placeholder="高" type="Number" />
            </el-col>
          </el-form-item>
          <el-form-item label="最长边长">
            <el-input v-model="rowData.maxSidelength" type="Number" />
          </el-form-item>
          <el-form-item label="最大重量">
            <el-input v-model="rowData.maxWeight" type="Number" />
          </el-form-item>
          <el-form-item label="计算方式">
            <el-radio-group v-model="rowData.countWay">
              <el-radio :label="'1'">首重续重</el-radio>
              <el-radio :label="'2'">重量范围</el-radio>
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
            <el-form-item v-for="(item, i) in rowData.range" :key="i" :label="'范围 ' + (i + 1)">
              <div class="range-item">
                <el-input v-model="item.range[0]" type="Number" placeholder="起始重量" />
                <span> ~ </span>
                <el-input v-model="item.range[1]" type="Number" placeholder="结束重量" />
                <el-divider direction="vertical" />
                <el-input v-model="item.price" type="Number" placeholder="该范围价格" />
                <i v-show="i > 0" class="el-icon-remove-outline" @click="removeRange(i)" />
              </div>
            </el-form-item>
            <div class="add-icon" @click="addRange"><i class="el-icon-circle-plus-outline" /></div>
          </template>
          <el-form-item>
            <el-button type="primary" :loading="onLoading" @click="onSubmit">新增</el-button>
            <el-button>取消</el-button>
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
        country: '',
        long: null,
        wide: null,
        high: null,
        maxSidelength: null,
        maxWeight: null,
        countWay: '1',
        FWeight: null,
        FWeightPrice: null,
        CWeight: null,
        CWeightPrice: null,
        range: null
      },
      onLoading: false
    }
  },
  watch: {
    // is_edit_open: function(newVal) {
    //   if (newVal) {
    //     this.rowData = JSON.parse(JSON.stringify(this.row))
    //   } else {
    //     this.rowData = {}
    //   }
    // }
  },
  methods: {
    initRowData() {
      this.rowData = {
        channelName: '',
        channelCode: '',
        channelType: '',
        country: '',
        long: null,
        wide: null,
        high: null,
        maxSidelength: null,
        maxWeight: null,
        countWay: '1',
        FWeight: null,
        FWeightPrice: null,
        CWeight: null,
        CWeightPrice: null,
        range: null
      }
    },
    handleClose() {
      this.$emit('closeAdd')
      this.initRowData()
    },
    async handleUndateChannel() {
      this.onLoading = true
      if (this.rowData.countWay === '1') {
        this.rowData.range = null
      } else {
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
      } else {
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
    removeRange(index) {
      this.rowData.range.splice(index, 1)
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
  justify-content: space-around;
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
