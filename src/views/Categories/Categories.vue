<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
<!--添加按钮-->
      <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="addCate">添加分类</el-button>
      </el-col>
      </el-row>
<!--      columns设置所有的列数，selection-type是否显示复选框，expand-type是否显示展开列-->
      <zk-table
          ref="table"
          show-index
          index-text="#"
          :data="cateList"
          :columns="cateColumns"
          :selection-type="false"
          :expand-type="false">
<!--        自定义模板列-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: #409EFF" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
<!--        操作按钮-->
        <template slot="opt" slot-scope="scope">
          <!--         编辑按钮-->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="cateEdit(scope.row.cat_id)" circle></el-button>
          <!--              s删除按钮-->
          <el-button type="danger" @click="delCate(scope.row)" icon="el-icon-delete" size="mini" circle></el-button>
        </template>
        <!--        等级分类-->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </zk-table>
<!--      分页器-->
      <el-pagination
          @size-change="handleSizeChange "
          @current-change="handleCurrentChange"
          :current-page="cateListPar.pagenum"
          :page-sizes="[5,10, 20, 30]"
          :page-size="cateListPar.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
<!--      添加分类弹出框-->
      <el-dialog
          title="添加分类"
          :visible.sync="cateDialog"
          width="30%"
          center @close="cateDialogClose">
        <el-form :model="cateForm" :rules="cateFormRul" ref="cateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="cateForm.cat_name"></el-input>
          </el-form-item>
<!--        级联选择框 options数据源 props配置对象-->
          <el-form-item label="父级分类">
            <el-cascader
              v-model="cateCascaderkeys"
              :options="parentcateList"
              expand-trigger="hover"
              :props="cateProps"
              @change="CatehandleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateDialog = false">取 消</el-button>
          <el-button type="primary" @click="addCateGo">确 定</el-button>
        </span>
      </el-dialog>
      <!--      编辑分类弹出框-->
      <el-dialog
          title="添加分类"
          :visible.sync="cateEditDialog"
          width="30%"
          center @close="cateEditClose">
        <el-form :model="cateEditForm" :rules="cateEditFormRul" ref="cateEditFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="cateEditForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="cateEditGo(cateEditForm.cat_id)">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {request} from "../../network/request";

  export default {
    name: "Categories",
    created() {
      this.getCateList()
    },
    data () {
      return {
        cateColumns:[
          {
            label:'分类名称',
            prop:'cat_name'
          },
          {
            label:'是否有效',
            prop:'cat_deleted',
            //自定义模板列
            type:'template',
            //模板列名称
            template:'isOk'
          },
          ,
          {
            label:'排序',
            //自定义模板列
            type:'template',
            //模板列名称
            template:'sort',

          },
          {
            label:'操作',
            //自定义模板列
            type:'template',
            //模板列名称
            template:'opt',

          },
        ],
        cateListPar:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        //数据数组
        cateList: [],
        // 总数据条数
        total:0,
      //  是否展示添加分类对话框
        cateDialog:false,
      //  父级分类列表
        parentcateList:[],
      //  添加分类数据
        cateForm:{
          //分类名称
          cat_name:'',
          //父级分类id
          cat_pid:0,
          //分类登记，默认一级
          cat_level:0,

        },
        //添加分类规则
        cateFormRul:{
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8个字符', trigger: 'blur' }
          ],
        },
        cateCascaderkeys:[],
        cateProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          //允许选择任意分类
          checkStrictly: true
        },
        // 是否显示编辑分类对话框
        cateEditDialog:false,
      //  编辑分类数据
        cateEditForm:{
          cat_name:'',
          cat_id:''
        },
        //编辑分类校验规则
        cateEditFormRul: {
          cat_name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 3, max: 8, message: '长度在 3 到 8个字符', trigger: 'blur' }]
        }
      }
    },
    methods:{
      //获取数据列表
      getCateList (){
        request({
          url:'categories',
          params:this.cateListPar
        }).then(res=>{
          this.cateList=res.data.data.result
          this.total=res.data.data.total
        })
      },
      //当分页器改条数时触发
      handleSizeChange(newPageSize){
        this.cateListPar.pagesize=newPageSize
        this.getCateList()
      },
      //当分页器改变页时触发
      handleCurrentChange(newPage){
        this.cateListPar.pagenum=newPage
        this.getCateList()
      },
      //添加按钮
      addCate(){
        this.cateDialog=true
        request({
          url:'categories',
          params: {type:2}
        }).then(res=>{
          this.parentcateList=res.data.data
          // console.log(this.parentcateList);
        })
      },
      // 当级联选择框值改变时触发
      CatehandleChange(){
        // console.log(this.cateCascaderkeys);
        if(this.cateCascaderkeys.length>0){
          // 设置父级分类
          this.cateForm.cat_pid=this.cateCascaderkeys[this.cateCascaderkeys.length-1]
          this.cateForm.cat_level=this.cateCascaderkeys.length
          // console.log(this.cateForm.cat_pid);
          // console.log(this.cateForm.cat_level);
          return
        }else {
          this.cateForm.cat_pid=0
          this.cateForm.cat_level=0
        }
      },
      // 确定添加分类
      addCateGo(){
        //发送请求确认添加
        this.$refs.cateFormRef.validate(valid=>{
          if(!valid) return this.$message.error('请输入分类名称')
          request({
            url:'categories',
            method:'post',
            data:this.cateForm
          }).then(res=>{
            this.$message.success('分类添加成功')
            this.getCateList()
            this.cateDialog = false
          })

        })
      },
      //关闭对添加话框
      cateDialogClose(){
        this.$refs.cateFormRef.resetFields(),
          this.cateCascaderkeys=[]
      },
      // 关闭编辑对话框
      cateEditClose(){
        //重置表单
        this.$refs.cateEditFormRef.resetFields()
        this.cateEditDialog=false
      },
      //编辑按钮
      cateEdit(id){
        // console.log(id)
        // 发送请求获取当前数据
        request({
          url:'categories/'+id
        }).then(res=>{
          this.cateEditForm=res.data.data
          // console.log(this.cateEditForm)
        })
        this.cateEditDialog=true
      },
    //  确认编辑按钮
      cateEditGo(id){
        // console.log(id);
        this.$refs.cateEditFormRef.validate(valid=>{
          if (!valid) return this.$message.error('请输入正确分类名称')
          request({
            url:'categories/'+id,
            method: 'put',
            data:this.cateEditForm
          }).then(res=>{
            this.$message.success('数据更新成功')
            this.getCateList()
            this.cateEditDialog = false
          }).catch(err=>{
            this.$message.error('数据更新失败')
          })
        })
      },
      //删除按钮
      async delCate(user){
        // console.log(user);
        const confirm=await this.$confirm(`此操作将永久删除${user.cat_name}分类, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //console.log(confirm);  //cancel取消confirm确认
       if(confirm==='cancel') return this.$message.error('已取消删除')
        request({
          url:'categories/'+user.cat_id,
          method:'delete'
        }).then(res=>{
          this.$message.success('删除成功')
          this.getCateList()
          this.cateDialog = false
        }).catch(err=>{
          this.$message.error('删除失败，请重试')
        })

      }
    }
  }
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}
  .zk-table{
    margin-bottom: 15px;
  }
</style>
