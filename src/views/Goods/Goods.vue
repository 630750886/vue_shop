<template>
  <div>
      <!--    面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!--      搜索框和按钮-->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" class="input-with-select" clearable @clear="getGoodsList" v-model="queryInfo.query">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addNewGoods">添加商品</el-button>
          </el-col>
        </el-row>
<!--        Tab表格-->
          <el-table
            :data="goodsList"
            style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column width="80px" prop="goods_price" label="商品价格"></el-table-column>
            <el-table-column width="80px" prop="goods_weight" label="商品重量"></el-table-column>
            <el-table-column width="80px" prop="goods_number" label="商品数量"></el-table-column>
            <el-table-column width="180px" label="创建时间">
              <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column width="180px">
<!--              操作按钮-->
              <template slot-scope="scope">
                <el-row>
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods" circle ></el-button>
                  <!--              s删除按钮-->
                  <el-button type="danger" @click="delGoods(scope.row.goods_id)" icon="el-icon-delete" size="mini" circle></el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
<!--        分页器-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
  </div>
</template>

<script>
  import {request} from "../../network/request";

  export default {
    name: "Goods",
    data(){

      return {
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        goodsList:[],
        total:0
      }
    },
    created() {
      this.getGoodsList()
    },
    methods:{
      getGoodsList(){
        request({
          url:'goods',
          params:this.queryInfo
        }).then(res=>{
          console.log(res.data.data);
          this.total=res.data.data.total
          this.goodsList=res.data.data.goods
        })
      },
      //添加按钮
      addNewGoods(){
        this.$router.push('/goods/addgoods')
      },
      //页数改变时触发
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getGoodsList()
      },
      //页面条数改变时触发
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getGoodsList()
      },
      //删除按钮
      async delGoods(goods_id){
        console.log(goods_id);
        const confirm=await this.$confirm(`此操作将永久删除该商品, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //取消confirm为cancel，确定confirm为confirm
        if(confirm=='cancel') return this.$message.error('已取消删除')
        request({
          url:'goods/'+goods_id,
          method:'delete'
        }).then(res=>{
          console.log(res.data);
          this.$message.success('删除成功')
          this.getGoodsList()
        })
      },
      // 编辑商品
      editGoods(){

      },
    }
  }
</script>

<style lang="less" scoped>

</style>
