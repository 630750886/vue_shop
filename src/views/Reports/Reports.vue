<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区-->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  // 引入 echarts
  import * as echarts from 'echarts'
  // 导入对象深拷贝
  import _ from 'lodash'
  export default {

    name: "Reports",
    data () {
      return {
// 需要合并的对象
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
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
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    //此时页面上元素已经渲染完毕
    mounted() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      request({
        url:'reports/type/1'
      }).then(res=>{
        console.log(res.data);
        // 准备数据配置项
       const result=_.merge(res.data.data,this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
      })


    }
  }
</script>

<style lang="less" scoped>

</style>
