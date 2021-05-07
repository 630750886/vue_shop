<template>
  <div>
<!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片-->
    <el-card class="box-card">
<!--      搜索框和按钮-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addNewUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!--    添加用户弹出层-->
      <el-dialog
          title="添加新用户"
          :visible.sync="addUserDialog"
          width="30%"
          @close="cancelAdding"
          center>
        <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserGo">确 定</el-button>
      </span>
      </el-dialog>
<!--      修改用户信息-->
      <el-dialog
          title="修改用户信息"
          :visible.sync="modifyUserDialog"
          width="30%"
          @close="cancelModify"
          center>
        <el-form :model="modifyUserForm" :rules="modifyUserRules" ref="modifyUserRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" >
            <el-input :disabled="true" v-model="modifyUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="modifyUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="modifyUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="modifyUserDialog = false">取 消</el-button>
            <el-button type="primary" @click="modifyUserGo(modifyUserForm.id)">确 定</el-button>
      </span>
      </el-dialog>
<!--      Table 表格-->
      <el-table
          :data="userList.users"
          border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
<!--              scope.row为所有数据-->
              <el-switch @change="statusSwitch(scope.row)"
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" circle @click="modifyUser(scope.row.id)"></el-button>
<!--              s删除按钮-->
              <el-button type="danger" icon="el-icon-delete" @click="delIdUser(scope.row)" circle></el-button>
  <!--            权限管理提示框-->
              <el-tooltip class="item" effect="dark" content="权限管理" placement="top">
                <el-button type="warning" @click="distributionRights(scope.row)" icon="iconfont icon-permissions-list" circle></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
<!--      分页器 current-pagedan当前页数   page-size当前页面最多显示-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1,2, 3,5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userList.total">
      </el-pagination>
    </el-card>
<!--    分配权限对话框-->
    <el-dialog
        title="提示"
        :visible.sync="rightsDialog"
        width="30%"
        center>
      <p>用户名：{{disUserInfo.username}}</p>
      <p>用户角色：{{disUserInfo.role_name}}</p>
      <p>分配新的角色
        <template>
          <el-select v-model="rightsUserId" placeholder="请选择">
            <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </template>
      </p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rightsDialog = false">取 消</el-button>
    <el-button type="primary" @click="rightToaMendGo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "../../network/request";

  export default {
    name: "Users",
    methods:{
      //取消添加用户
      cancelAdding(){
        this.$refs.addUserRef.resetFields()
      },
      //取消修改用户
      cancelModify(){
        this.$refs.modifyUserRef.resetFields()
      },
      //添加用户
      addUserGo(){
        this.$refs.addUserRef.validate(valid=>{
          if (!valid) return
          request({
            url:'users',
            method: 'post',
            data:this.addUserForm
          }).then(res=>{
            this.addUserDialog = false
            this.getUserList()
            this.$message.success('用户添加成功')
          }).catch(err=>{
            this.$message.error('用户添加失败，请重试')
          })
        })

      },
      //修改用户信息
      modifyUserGo(id){
        this.$refs.modifyUserRef.validate(valid=>{
          if(!valid) return
          request({
            url:'users/'+id,
            method:'put',
            data:this.modifyUserForm
          }).then(res=>{
            this.$message.success('修改成功')
            this.getUserList()
            this.modifyUserDialog=false
          })
        })
      },
      // 删除用户
       async delIdUser(userInfo){
        const res=await this.$confirm(`此操作将永久删除${userInfo.username}用户, 是否继续?`, '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).catch(err=>err)
         //取消res为cancel，确定res为confirm
         if(res=='cancel') return this.$message.error('已取消删除')
         request({
           url:'users/'+userInfo.id,
           method:'delete'
         }).then(res=>{
           this.$message.success(`删除用户${userInfo.username}成功`)
           this.getUserList()
         })

      },
      // 监听pagesize的改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getUserList()
      },
      //页面切换时触发
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getUserList()
      },
      //添加用户按钮线上添加用户框
      addNewUser(){
        this.addUserDialog=true
      },
      modifyUser(id){
        this.modifyUserDialog=true
        request({
          url:'users/'+ id
        }).then(res=>{
          // console.log(res.data.data)
          this.modifyUserForm=res.data.data
        })
      },
      // 获取列表请求
      getUserList(){
        request({
          url:'users',
          params: this.queryInfo

        }).then(res=>{
          this.userList=res.data.data
        })
      },
      // 修改swich开关
      statusSwitch(swdata){
        request({
          url:`users/${swdata.id}/state/${swdata.mg_state}`,
          method:'put',
        }).then(res=>{
          this.$message.success('状态设置成功')
        }).catch(error=>{
          swdata.mg_state=!swdata.mg_state
          this.$message.error('状态设置失败')
        })
      },
      //分配权限按钮
      distributionRights(disUserInfo){
        this.rightsDialog=true
        this.disUserInfo=disUserInfo
        // console.log(this.disUserInfo)
        request({
          url:'roles'
        }).then(res=>{

          this.rolesList=res.data.data
          // console.log(this.rolesList)
        })
      },
      //确认修改权限
      rightToaMendGo(){
        console.log(this.disUserInfo.id)
        console.log(this.rightsUserId)
        if(!this.rightsUserId) return this.$message.error('请分配权限')
        request({
          url:`users/${this.disUserInfo.id}/role`,
          method:'put',
          data:{
            rid:this.rightsUserId
          }
        }).then(res=>{
          this.$message.success('角色分配成功')
          console.log(res.data)
          this.rightsDialog = false
          this.getUserList()
          this.rightsUserId=''
          this.disUserInfo=[]

        }).catch(err=>{
          this.$message.error('角色分配失败')
        })
      }
    },
    created() {
      this.getUserList()

    },
    data(){

      //自定义用户验证规则
      const checkEmail=(rule, value, cb)=>{
        const regEmail=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if(regEmail.test(value)){
          // 验证通过
          return cb()
        }
        cb(new Error('请输入合法邮箱'))
      }
      const checkMobile=(rule, value, cb)=>{
        const regMobile=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

        if(regMobile.test(value)){
          // 验证通过
          return cb()
        }
        cb(new Error('请输入正确手机号'))
      }
      return{
        //角色列表
        rolesList:[],
        //分配新角色的id
        rightsUserId:[],
        //分配权限对话框
        rightsDialog:false,
        //修改权限的用户信息
        disUserInfo:[],
        userList:{},
        //获取用户列表参数
        queryInfo:{
          //搜索关键字
          query: '',
          //第几页
          pagenum:1,
          // 一共多少页
          pagesize: 2,
        },
        // 添加用户弹窗
        addUserDialog:false,
        //修改用户信息
        modifyUserDialog:false,
        // 添加用户的form表单
        addUserForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        // 添加用户验证规则
        addUserRules:{
          username:[{ required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
          password:[{ required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
          // 调用自定义规则validator
          email:[{ required: true, validator:checkEmail, trigger: 'blur' }],
          mobile:[{ required: true, validator:checkMobile, trigger: 'blur' }]
        },
        // 修改用户信息数据
        modifyUserForm:{
          username:'',
          email:'',
          mobile:''
        },
        // 修改用户验证规则
        modifyUserRules:{
          username:[{ required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
          // 调用自定义规则validator
          email:[{ required: true, validator:checkEmail, trigger: 'blur' }],
          mobile:[{ required: true, validator:checkMobile, trigger: 'blur' }]
        },
      }
    },
  }
</script>

<style lang="less" scoped>
  .el-pagination{
    margin-top: 10px;
  }
  </style>
