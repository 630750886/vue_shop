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
      <!--      搜索框-->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" clearable @clear="getOrdersList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--        Tab表格-->
      <el-table
        :data="ordersList"
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price"  width="100px" label="订单价格"></el-table-column>
        <el-table-column width="100px" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send"  width="100px" label="是否发货"></el-table-column>
        <el-table-column width="180px" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column  width="180px">
          <!--              操作按钮-->
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="orderEdit" ></el-button>
              <!--              位置按钮-->
              <el-button type="success" icon="el-icon-location" size="mini" @click="orderLocation" circle></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
<!--      分页器-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
<!--      编辑按钮弹出层-->
      <el-dialog
          title="修改地址"
          :visible.sync="editDialog"
          width="30%"
          @close="editClose">
        <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="请选择" prop="address">
            <el-cascader
                v-model="editForm.address"
                :options="cityData" :props="{ expandTrigger: 'hover' }">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailedAddress">
            <el-input v-model="editForm.detailedAddress"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDialog = false">确 定</el-button>
      </span>
      </el-dialog>
      <!--      物流按钮弹出层-->
      <el-dialog
          title="物流进度"
          :visible.sync="locationDialog"
          width="50%"
          @close="locationClose">
        <span>暂无物流信息</span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  import cityData from '../../assets/city_data'
  export default {
    name: "Orders",
    data () {
      return {
        //获取订单列表参数
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:5
        },
        //总条数
        total:0,
      // 订单列表
        ordersList:[],
        //编辑框显示
        editDialog:false,
      //  物流科显示
        locationDialog:false,
      //  编辑表单数据
        editForm:{
          address:[],
          detailedAddress:''
        },
        // 编辑规则
        editRules:{
          address: [
            { required: true, message: '请请选择区/县/市', trigger: 'blur' },
          ],
          detailedAddress: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
        },
        cityData,//城市数据
      }
    },
    methods:{
      //获取订单列表
      getOrdersList(){
        request({
          url:'orders',
          params:this.queryInfo
        }).then(res=>{
          console.log(res.data);
          this.ordersList=res.data.data.goods
          this.total=res.data.data.total
        })
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getOrdersList()
      },
      handleCurrentChange(newpage){
        this.queryInfo.pagenum=newpage
        this.getOrdersList()
      },
      editClose(){
        this.editDialog = false
        this.$refs.editRef.resetFields()
      },
      //编辑按钮
      orderEdit(){
        this.editDialog = true
      },
      //物流按钮
      orderLocation(){
        this.locationDialog = true
        request({
          url:'/kuaidi/1106975712662',
          method:'get'
        }).then(res=>{
          console.log(rea.data);
        }).catch(err=>{
          this.$message.error('获取物流进度失败')
        })
      },
    //  物流筐关闭
      locationClose(){
        this.locationDialog = false
      }
    },
    created() {
      this.getOrdersList()

    }
  }
</script>

<style lang="less" scoped>

</style>
