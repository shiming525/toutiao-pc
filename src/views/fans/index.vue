<template>
  <div class="container-fans">
    <el-card>
      <!-- 面包屑导航 -->
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fansList">
            <div class="fansPhoto" v-for="item in fansList" :key="item.id.toString()">
              <div class="block">
                <el-avatar :size="80" :src="item.photo"></el-avatar>
              </div>
              <p>{{item.name}}</p>
              <el-button type="primary" plain size="small">+关注</el-button>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="pager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="picture">
          <div ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'picture',
      reqParams: {
        page: 1,
        per_page: 21
      },
      // 总条数
      total: 0,
      // 粉丝列表
      fansList: []
    }
  },
  created () {
    this.getFans()
  },
  methods: {
    async getFans () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      //  将获取到的粉丝列表赋值给fansList
      this.fansList = data.results
      // 将总条数赋值给total
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getFans()
    }
  },
  mounted () {
    const main = this.$refs.main
    const myEcharts = echarts.init(main)
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    myEcharts.setOption(option)
  }
}
</script>

<style scoped lang='less'>
.fansList {
  .fansPhoto {
    width: 150px;
    height: 190px;
    border: 1px dashed #ddd;
    text-align: center;
    margin-right: 20px;
    margin-bottom: 20px;
    display: inline-block;
    .block {
      margin-top: 10px;
    }
  }
}
</style>
