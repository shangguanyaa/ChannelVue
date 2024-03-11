<template>
  <div>
    <el-drawer
      ref="drawer"
      :title="'编辑: ' + rowData.channelName"
      :before-close="handleClose"
      :visible.sync="is_edit_open"
      :size="width"
      direction="rtl"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <div class="contents">
          <div v-if="is_edit_open" class="left">
            <el-form ref="form" :model="rowData" label-width="100px">
              <el-form-item label="渠道名称">
                <el-input v-model="rowData.channelName" />
              </el-form-item>
              <el-form-item label="渠道代码">
                <el-input v-model="rowData.channelCode" placeholder="此代码为唯一的,不能和其他渠道相同" disabled />
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
              <el-form-item label="最大周长">
                <el-input v-model="rowData.volume" type="Number" placeholder="长 + (宽 + 高) * 2" />
              </el-form-item>
              <el-form-item label="长+宽+高">
                <el-input v-model="rowData.maxSumLWH" type="Number" placeholder="长 + 宽 + 高" />
              </el-form-item>
              <el-form-item label="最大重量">
                <el-input v-model="rowData.maxWeight" type="Number" />
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

              <!-- <el-form-item label="计算方式">
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
                    <template v-if="showOperate">
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
                <el-form-item label="智能生成区间">
                  <el-input v-model="AIRange" type="textarea" placeholder="仅限开发用, 或咨询开发者如何使用" />
                </el-form-item>
                <el-form-item label="智能生成价格">
                  <el-input v-model="AIPrice" type="textarea" placeholder="仅限开发用, 或咨询开发者如何使用" />
                </el-form-item>
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
              </template> -->

            </el-form>
          </div>
          <div v-if="rulesEdit" class="right">
            <template v-if="rowData.surcharge">
              <el-card v-for="(item, i) in rowData.surcharge" :key="i" class="right-card">
                <el-tag closable :type="'success'" @close="deleteGroup(i, item)">规则组 {{ i + 1 }}</el-tag>
                <el-select v-model="value" placeholder="请选择需要限制的参数" @change="selectRule(i)">
                  <el-option
                    v-for="items in options"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value"
                    :disabled="selectedRules.includes(items.value)"
                  />
                </el-select>
                <div v-for="(rule, key) in item" :key="key" class="group">
                  <el-card>
                    <div class="title">
                      <p>{{ ZH_Options[key] }}</p>
                      <p><i class="el-icon-error" @click="deleteRule(i, key)" /></p>
                    </div>
                    <p v-if="['weightRange', 'volumeRange'].includes(key)" class="item">
                      <span class="title">限制值范围(KG):</span>
                      <span class="input weightRange">
                        <el-input v-model="rule.range[0]" placeholder="起始值" :type="'Number'" />
                        <span style="margin: 0 10px;"> ~ </span>
                        <el-input v-model="rule.range[1]" placeholder="结束值" :type="'Number'" />
                      </span>
                    </p>
                    <p v-else class="item">
                      <span class="title">限制值:</span>
                      <span class="input">
                        <el-input v-model="rule.value" placeholder="产品该属性>=限制值" :type="'Number'" />
                      </span>
                    </p>
                    <p class="item">
                      <span class="title">超出价格:</span>
                      <span class="input">
                        <el-input v-model="rule.price" placeholder="触发后价格" :type="'Number'" />
                      </span>
                    </p>
                    <p class="item">
                      <span class="title">是否乘以燃油:</span>
                      <span class="input">
                        <el-radio-group v-model="rule.oil">
                          <el-radio :label="true">是</el-radio>
                          <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                      </span>
                    </p>
                    <p class="item">
                      <span class="title">附加费描述</span>
                      <span class="input">
                        <el-input v-model="rule.text" placeholder="会出现在试算附加费详情里" :type="'String'" />
                      </span>
                    </p>
                  </el-card>
                </div>
              </el-card>
            </template>

            <template v-if="rowData.customSurcharge">
              <el-card v-for="(item, i) in rowData.customSurcharge" :key="i + 'CustomSurcharge'" class="right-card">
                <el-tag closable @close="deleteCustomSurcharge(i, item)">可选附加费配置 {{ i + 1 }}</el-tag>
                <div class="group">
                  <el-card>
                    <div class="title">
                      <p>{{ item.text || '待定' }}</p>
                    <!-- <p><i class="el-icon-error" @click="deleteCustomSurcharge(i)" /></p> -->
                    </div>
                    <p>
                      <span>附加费描述:</span>
                      <el-input v-model="item.text" placeholder="附加费名称 显示在试算详情配置里" :type="'text'" />
                    </p>
                    <p>
                      <span>附加费价格:</span>
                      <el-input v-model="item.price" placeholder="附加费价格" :type="'Number'" />
                    </p>
                    <p>
                      <span>最低收费:</span>
                      <el-input v-model="item.minPrice" placeholder="最低收费" :type="'Number'" :disabled="item.type === 1" />
                    </p>
                    <p>
                      <span>计算方式:</span>
                      <el-radio-group v-model="item.type">
                        <el-radio :label="1">固定收费</el-radio>
                        <el-radio :label="2">每KG收费</el-radio>
                      </el-radio-group>
                    </p>
                    <p>
                      <span>是否乘以燃油:</span>
                      <el-radio-group v-model="item.oil">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </p>
                    <p>
                      <span>是否自动勾选:</span>
                      <el-radio-group v-model="item.autoSelect">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </p>
                  </el-card>
                </div>
              </el-card>
            </template>

            <el-button type="primary" @click="addGroup">新建规则组</el-button>
            <el-button type="primary" @click="addCustomSurcharge">新建可选附加费配置</el-button>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" :loading="onLoading" @click="onSubmit">修改</el-button>
          <el-button>取消</el-button>
          <el-button @click="toDoAI">智能生成</el-button>
          <el-button @click="rulesEditOpen">附加费配置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>

export default {
  name: 'ChannelBulkEdit',
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    is_edit_open: {
      type: Boolean,
      default: () => { false }
    },
    row: {
      type: Array,
      default: () => { [] }
    }
  },
  data() {
    return {
      rowData: {},
      withEle: [],
      ele1: false,
      ele2: false,
      ele3: false,
      onLoading: false,
      AIRange: '',
      AIPrice: '',
      rulesEdit: false,
      width: 650,
      options: [
        { value: 'maxLength', label: '最长边长(大于或等于)' },
        { value: 'secendLength', label: '第二边长(大于或等于)' },
        { value: 'minLength', label: '最短边长(大于或等于)' },
        { value: 'volume', label: '围长(长 + 2 * 高 + 2 * 宽)' },
        { value: 'weight', label: '单件结算重(大于或等于)' },
        { value: 'LWH', label: '长+ 宽+ 高(大于或等于)' },
        { value: 'weightSmaller', label: '单件结算重(小于或等于)' },
        { value: 'weightRange', label: '重量范围' }
      ],
      ZH_Options: {
        maxLength: '最长边长',
        secendLength: '第二边长',
        minLength: '最短边长',
        volume: '围长(长+2*高+2*宽)',
        weight: '单件结算重',
        LWH: '长+ 宽+ 高',
        weightSmaller: '单件结算重(小于或等于)',
        weightRange: '重量范围'
      },
      value: '',
      selectedRules: [],
      showOperate: true
    }
  },
  watch: {
    is_edit_open: function(newVal) {
      if (newVal) {
        console.log('打开了')
        console.log(this.row[0])
        this.rowData = JSON.parse(JSON.stringify(this.row[0]))
        this.withEle = this.rowData.withElectricity.split(',')
        this.initCheckBoxs()

        console.log(this.rowData.surcharge)
        if (Array.isArray(this.rowData.surcharge) && this.rowData.surcharge.length !== 0) {
          for (const item of this.rowData.surcharge) {
            for (const key in item) {
              this.selectedRules.push(key)
            }
          }
        }
      } else {
        console.log('关闭了')
        this.rowData = {}
        this.selectedRules = []
      }
    }
  },
  methods: {
    deleteCustomSurcharge(index) {
      this.rowData.customSurcharge.splice(index, 1)
    },
    addCustomSurcharge() {
      if (!this.rowData.customSurcharge || !Array.isArray(this.rowData.customSurcharge)) {
        this.rowData.customSurcharge = []
      }
      this.rowData.customSurcharge.push({
        text: '', // 自定义附加费名称
        price: 30, // 价格
        type: 1, // 计费方式: 1: 固定收费 2: 每KG收费
        minPrice: 0, // 最低收费, 没有这个规则可以输入 0
        autoSelect: true, // 是否自动加上,
        oil: false // 是否需要乘以当周燃油
      })
      console.log(this.rowData.customSurcharge)
    },
    deleteGroup(index, item) {
      // console.log(index, item)
      for (const key in item) {
        this.deleteRule(index, key)
      }
      this.rowData.surcharge.splice(index, 1)
      console.log(this.rowData.surcharge)
    },
    deleteRule(index, key) {
      // console.log(index, key)
      delete this.rowData.surcharge[index][key]
      this.selectedRules.splice(this.selectedRules.indexOf(key), 1)
    },
    selectRule(index) {
      this.$set(this.rowData.surcharge[index], this.value, {
        value: 0,
        price: 0,
        range: [0, 0], // 范围数值
        oil: false,
        text: ''
      })
      this.selectedRules.push(this.value)
      this.value = ''
      console.log(this.rowData.surcharge)
      this.$forceUpdate()
    },
    addGroup() {
      if (!this.rowData.surcharge || !Array.isArray(this.rowData.surcharge)) {
        this.rowData.surcharge = []
      }
      // this.rowData.surcharge.push({})
      this.rowData.surcharge = [...this.rowData.surcharge, {}]
      console.log(this.rowData)
    },
    rulesEditOpen() {
      if (this.rulesEdit) {
        this.rulesEdit = false
        this.width = 650
      } else {
        this.rulesEdit = true
        this.width = '90%'
      }
    },
    deleteOperate() {
      // const range = this.rowData.range
      // for (const item of range) {
      //   delete item.operate
      // }
      // this.$set(this.rowData, 'ragne', range)
      // console.log(this.rowData.range)
      // this.$forceUpdate()
      for (const item of this.rowData.range) {
        item.operate = 0
      }
      this.showOperate = false
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
      this.showOperate = true
      // const range = this.rowData.range
      // for (const item of range) {
      //   item.operate = 0
      // }
      // this.$set(this.rowData, 'ragne', range)
      // // this.rowData.range = range
      // console.log(this.rowData.range)
      // this.$forceUpdate()
    },
    toDoAI() {
      const range = []
      const rangeArr = this.AIRange.split(',')
      const priceArr = this.AIPrice.split(' ')
      for (const key in rangeArr) {
        range.push({
          range: rangeArr[key],
          price: priceArr[key]
        })
      }
      console.log(range)
      this.rowData.range = range
    },
    chick1(val) {
      this.chickCheck(val, 1)
      // this.ele1 = val
    },
    chick2(val) {
      this.chickCheck(val, 2)
      // this.ele2 = val
    },
    chick3(val) {
      this.chickCheck(val, 3)
      // this.ele3 = val
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
      console.log('initBox')
      for (const item of this.withEle) {
        switch (item) {
          case '1':
            this.ele1 = true
            this.$set(this, 'ele1', true)
            break
          case '2':
            this.ele2 = true
            this.$set(this, 'ele2', true)
            break
          case '3':
            this.ele3 = true
            this.$set(this, 'ele3', true)
            break
          default:
            break
        }
      }
      console.log(this.ele1)
      console.log(this.ele2)
      console.log(this.ele3)
      this.$forceUpdate()
    },
    handleClose() {
      console.log(this.rowData, 'rowData')
      this.$emit('closeEdit')
    },
    async handleUndateChannel() {
      this.onLoading = true
      this.rowData.withElectricity = this.withEle.toString()
      const data = []
      data.push(this.rowData)
      for (const i in this.row) {
        if (i > 0) {
          data.push({ ...this.rowData })
          data[i].channelID = this.row[i].channelID
        }
      }
      console.log(data)
      const res = await this.$store.dispatch('channel/bulkInsertUpdate', { CList: data })
      if (res.results) {
        this.$emit('updateSuccess')
      }
      this.onLoading = false
    },
    onSubmit() {
      if (!this.rowData.channelType) {
        this.$message({
          type: 'warning',
          message: '请输入渠道类型'
        })
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
    doLogRowData() {
      console.log(this.rowData)
    }
  }
}
</script>

<style>
.el-drawer__body {
  /* overflow-y: auto !important; */
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
  /* overflow-y: auto !important; */
}
.demo-drawer__content {
  padding: 0 20px;
  display: flex;
  justify-content: space-around;
}
.demo-drawer__content .left {
  min-width: 600px;
}
.demo-drawer__content .right {
  width: 50%;
  min-width: 400px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #5f5f5f;
}
.el-tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.group {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.group .title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  font-size: 18px;
  line-height: 24px;
  font-family: '微软雅黑';
  font-weight: 600;
}
.group p {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  margin-bottom: 6px;
}
.group .item {
  display: flex;
  flex-direction: row;
}
.group .item .title {
  display: block;
  width: 150px;
  font-weight: 400;
  font-size: 16px;
}
.group .item .input{
  flex: 1;
}
.group .item .weightRange {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.right-card {
  margin-bottom: 16px;
}
.right-card >>> .el-card__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
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
