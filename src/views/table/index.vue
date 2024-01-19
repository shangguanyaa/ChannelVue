<template>
  <div class="app-container">
    <div class="header">
      <el-input v-model="keywords" placeholder="请输入关键词" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getAllChannelList" />
      </el-input>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addOpen = true">新增渠道</el-button>
    </div>
    <div class="table"><el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="channelName"
        label="渠道名"
        width="350"
      />
      <el-table-column
        prop="country"
        label="支持国家"
        width="300"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="所有支持国家"
            width="500"
            trigger="hover"
            :content="scope.row.country"
          >
            <span slot="reference">{{ scope.row.country }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="province"
        label="计算类型"
        width="120"
        :align="'center'"
      >
        <template slot-scope="scope">
          <el-tag
            :type="['primary', 'success', 'info', 'warning'][Number(scope.row.countWay) - 1]"
            disable-transitions
          >{{ ['首重续重', '重量范围', '重量对应价格', '直接计算'][Number(scope.row.countWay) - 1] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="channelType"
        label="渠道类型"
        width="150"
      />
      <el-table-column
        prop="FWeight"
        :label="'首重续重('+unitText+')'"
        width="120"
        :align="'center'"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.FWeight">{{ scope.row.FWeight / unit }} / {{ scope.row.CWeight / unit }}</span>
          <span v-show="!scope.row.FWeight"> - </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="FWeight"
        label="首重/续重价格"
        width="120"
        :align="'center'"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.FWeightPrice">{{ scope.row.FWeightPrice }} / {{ scope.row.CWeightPrice }}</span>
          <span v-show="!scope.row.FWeight"> - </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="FWeight"
        :label="'重量范围与金额('+unitText+'/元)'"
        :align="'left'"
        width="250"
      >
        <template slot-scope="scope">
          <div v-show="scope.row.countWay === '2'">
            <p v-for="(item, i) in scope.row.range" :key="i">
              {{ item.range[0] / unit }} ~ {{ item.range[1] / unit }} / {{ item.price }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="maxSidelength"
        label="最长边长(cm)"
        width="120"
        :align="'center'"
      />
      <el-table-column
        prop="maxWeight"
        :label="'最大重量('+unitText+')'"
        width="120"
        :align="'center'"
      >
        <template slot-scope="scope">
          <span>{{ (scope.row.maxWeight / unit).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="maxWeight"
        label="材积 / 周长"
        width="120"
        :align="'center'"
      >
        <template slot-scope="scope">
          <span>{{ (scope.row.volume) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table></div>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <ChannelEdit :is_edit_open="editOpen" :row="editRowData" @closeEdit="closeEdit" @updateSuccess="updateSuccess" />
    <ChannelAdd :is_add_open="addOpen" :row="editRowData" @closeAdd="closeAdd" @updateSuccess="updateSuccess" />
  </div>

</template>

<script>

import ChannelEdit from './components/ChannelEdit'
import ChannelAdd from './components/ChannelAdd.vue'

export default {
  components: { ChannelEdit, ChannelAdd },
  data() {
    return {
      tableData: [],
      unitText: 'G',
      unit: 1,
      editOpen: false,
      editRowData: {},
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      addOpen: false,
      keywords: ''
    }
  },
  created() {
    this.getAllChannelList()
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size
      this.getAllChannelList()
    },
    handleCurrentChange(index) {
      this.pageIndex = index
      this.getAllChannelList()
    },
    addView() {
      console.log('打开添加渠道')
      this.addOpen = true
    },
    currentChange(page) {
      this.pageIndex = page
      this.getAllChannelList()
    },
    handleClick(row) {
      this.editRowData = row
      console.log(this.editRowData)
      this.editOpen = true
    },
    async getAllChannelList() {
      const data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keywords: this.keywords
      }
      const res = await this.$store.dispatch('channel/getAllChannelList', data)
      console.log(res)
      this.tableData = res.results.res || []
      this.total = res.results.total || 0
    },
    closeEdit() {
      this.editOpen = false
    },
    closeAdd() {
      this.addOpen = false
    },
    updateSuccess() {
      this.closeEdit()
      this.getAllChannelList()
    }
  }
}
</script>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}
.input-with-select {
  width: 300px;
}
.table {
  margin-bottom: 20px;
}
</style>
