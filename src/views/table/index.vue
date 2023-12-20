<template>
  <div class="app-container">
    <el-table
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
      />
      <el-table-column
        prop="province"
        label="省份"
        width="120"
        :align="'center'"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.countWay === '1' ? 'primary' : 'success'"
            disable-transitions
          >{{ scope.row.countWay === '1' ? '首重续重' : '重量范围' }}</el-tag>
        </template>
      </el-table-column>
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
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>

export default {
  data() {
    return {
      tableData: [],
      unitText: 'G',
      unit: 1
    }
  },
  created() {
    this.getAllChannelList()
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    async getAllChannelList() {
      const res = await this.$store.dispatch('channel/getAllChannelList')
      console.log(res)
      this.tableData = res.results || []
    }
  }
}
</script>
