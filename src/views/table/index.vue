<template>
  <div class="app-container">
    <div class="header">
      <div class="options">
        <el-select
          v-model="selectCountry"
          filterable
          clearable
          placeholder="请选择国家"
          style="margin-right: 16px;"
        >
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
        <el-select
          v-model="selectCountType"
          filterable
          clearable
          placeholder="计算方式"
          style="margin-right: 16px;"
        >
          <el-option
            v-for="item in countType"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="keywords" placeholder="请输入渠道名" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getAllChannelList('keywords')" />
        </el-input>
      </div>

      <div>
        <el-button v-show="selectedCIDArr.length !== 0" type="primary" icon="el-icon-plus" :disabled="!admin" @click="bulkEdit">批量编辑</el-button>
        <el-button v-show="selectedCIDArr.length !== 0" type="primary" icon="el-icon-plus" :disabled="!admin" @click="bulkDestroy">批量删除</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" :disabled="!admin" @click="addOpen = true">新增渠道</el-button>
      </div>

    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed
          type="selection"
          width="55"
          :align="'center'"
        />
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
          prop="disabled"
          label="计算类型"
          width="120"
          :align="'center'"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.disabled ? 'danger' : ''"
              disable-transitions
            >{{ scope.row.disabled ? '禁用' : '正常' }}</el-tag>
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
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="所有范围"
              width="300"
              trigger="hover"
            >
              <div v-if="scope.row.countWay === '2'">
                <p v-for="(item, i) in scope.row.range" :key="i">
                  {{ item.range[0] / unit }} ~ {{ item.range[1] / unit }} / {{ item.price }}
                </p>
              </div>
              <div slot="reference">
                <p v-if="scope.row.countWay === '2'">{{ scope.row.range[0].range[0] / unit }} ~ {{ scope.row.range[0].range[1] / unit }}  / {{ scope.row.range[0].price }}</p>
              </div>
            </el-popover>
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
          width="150"
          :align="'center'"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="!admin" @click="handleClick(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" :disabled="!admin" @click="disabled(scope.row)">
              {{ scope.row.disabled ? '解禁' : '禁用' }}
            </el-button>
            <el-divider direction="vertical" />
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="这是一段内容确定删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" type="text" size="small" :disabled="!admin">删除</el-button>
            </el-popconfirm>
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

    <ChannelBulkEdit :is_edit_open="bulkEditOpen" :row="selectedArr" @closeEdit="closeBulkEdit" @updateSuccess="updateSuccess" />
    <ChannelEdit :is_edit_open="editOpen" :row="editRowData" @closeEdit="closeEdit" @updateSuccess="updateSuccess" />
    <ChannelAdd :is_add_open="addOpen" :row="editRowData" @closeAdd="closeAdd" @updateSuccess="updateSuccess" />
  </div>

</template>

<script>

import ChannelEdit from './components/ChannelEdit'
import ChannelBulkEdit from './components/ChannelBulkEdit.vue'
import ChannelAdd from './components/ChannelAdd.vue'
import { isAdmin } from '@/utils/auth'

const { country } = require('@/utils/country')

export default {
  components: { ChannelEdit, ChannelAdd, ChannelBulkEdit },
  data() {
    return {
      options: country, // 选择国家下拉框
      selectCountry: '', // 选择国家的字符串
      countType: [ // 计算类型筛选
        { name: '首重续重', value: 1 },
        { name: '重量范围', value: 2 },
        { name: '重量对应价格', value: 3 },
        { name: '直接计算', value: 4 }
      ],
      selectCountType: null,
      tableData: [],
      unitText: 'G',
      unit: 1,
      editOpen: false,
      editRowData: {},
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      addOpen: false,
      keywords: '',
      selectedCIDArr: [],
      loading: false,
      bulkEditOpen: false,
      selectedArr: [],
      admin: isAdmin()
    }
  },
  created() {
    this.getAllChannelList()
    this.admin = isAdmin()
  },
  methods: {
    async disabled(item) {
      console.log(item)
      const res = await this.$store.dispatch('channel/changeStatus', {
        channelID: item.channelID
      })
      console.log(res)
      if (res.code === 200) {
        this.getAllChannelList()
      } else {
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      }
    },
    bulkEdit() {
      this.bulkEditOpen = true
    },
    handleSelectionChange(selectedArr) {
      console.log(selectedArr)
      this.selectedArr = selectedArr
      const selectedCIDArr = []
      for (const item of selectedArr) {
        selectedCIDArr.push(item.channelID)
      }
      this.selectedCIDArr = selectedCIDArr
    },
    async bulkDestroy() {
      if (this.selectedCIDArr.length === 0 || !Array.isArray(this.selectedCIDArr)) {
        this.$message({
          type: 'warning',
          message: '请选择需要删除的数据'
        })
        return
      }
      this.$confirm(`此操作将永久删除选中的 ${this.selectedCIDArr.length} 条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$store.dispatch('channel/deleteChannels', {
          ChannelIDArr: this.selectedCIDArr
        })
        if (res.code === 200) {
          this.getAllChannelList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async handleDelete(row) {
      console.log(row)
      const res = await this.$store.dispatch('channel/deleteChannels', {
        ChannelIDArr: [row.channelID]
      })
      if (res.code === 200) {
        this.getAllChannelList()
      }
    },
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
    async getAllChannelList(val) {
      if (val === 'keywords') {
        this.pageIndex = 1
      }
      const data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keywords: this.keywords
      }
      this.selectCountry && Object.assign(data, { country: this.selectCountry })
      this.selectCountType && Object.assign(data, { type: this.selectCountType })

      this.loading = true
      const res = await this.$store.dispatch('channel/getAllChannelList', data)
      console.log(res)
      this.tableData = res.results.res || []
      this.total = res.results.total || 0
      this.loading = false
    },
    closeEdit() {
      this.editOpen = false
      this.bulkEditOpen = false
    },
    closeBulkEdit() {
      this.bulkEditOpen = false
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
