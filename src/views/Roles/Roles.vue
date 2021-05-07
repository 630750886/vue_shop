<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="addUserRol">添加用户</el-button>
        </el-col>
      </el-row>
<!--      权限管理列表-->
      <el-table
        :data="userListRol"
        border>
<!--        用户所有权限列表-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <el-col :span="5"><el-tag closable @close="removeRolId(scope.row,item1)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6"><el-tag  type="success" closable @close="removeRolId(scope.row,item2)">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                  <el-col :span="18"><el-tag v-for="(item3,i3) in item2.children" :key="item3.id" @close="removeRolId(scope.row,item3)" closable type="warning">{{item3.authName}}</el-tag></el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserRol(scope.row.id)">编辑</el-button>
              <!--              s删除按钮-->
              <el-button type="danger" @click="delUserRol(scope.row)" icon="el-icon-delete" size="mini">删除</el-button>
              <!--            权限管理提示框-->
                <el-button type="warning" @click="assignPermissionsRol(scope.row)" icon="iconfont icon-permissions-list" size="mini">分配权限</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--     添加权限用户-->
    <el-dialog
      title="提示"
      :visible.sync="userListRolDialog"
      width="30%"
      center>
      <el-form ref="userRolRef" :rules="userRolRule" :model="userRolForm" label-width="80px">
        <el-form-item label="角色名称"  prop="roleName">
          <el-input v-model="userRolForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="userRolForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserRolCancel">取 消</el-button>
        <el-button type="primary" @click="userListRolGo">确 定</el-button>
      </span>
    </el-dialog>
    <!--     编辑权限用户-->
    <el-dialog
      title="提示"
      :visible.sync="editUserRolRolDialog"
      width="30%"
      center>
      <el-form ref="editUserRolRef" :rules="editUserRolRule" :model="editUserRolForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input disabled  v-model="editUserRolForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editUserRolForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserRolCancel">取 消</el-button>
        <el-button type="primary" @click="editUserListRolGo(editUserRolForm.roleId)">确 定</el-button>
      </span>
    </el-dialog>
<!--    添加权限按钮-->
    <el-dialog
        title="提示"
        :visible.sync="assignPermissionsDialog"
        width="30%"
        center @close="assignPermissionsClose">
      <el-tree
          :data="permissionListRol"
          :props="treeProps" show-checkbox node-key="id"
          default-expand-all :default-checked-keys="drfKeys" ref="treeRef">
<!--        node-key每个节点唯一的值，default-expand-all默认展开 default-checked-keys默认勾选的节点的 key 的数组-->
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="assignPermissionsDialog = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "../../network/request";

  export default {
    name: "Roles",
    data(){
      return{
        //当前即将分配权限的id
        roleId:'',
        //默认勾选的节点的 key 的数组
        drfKeys:[],
        // 树型控件绑定对象
        treeProps: {
          label:'authName',
          children:'children',
        },
       userListRol:[],
        //添加权限用户窗口
       userListRolDialog:false,
        // 添加权限按钮
        assignPermissionsDialog:false,
        //编辑权限用户窗口
        editUserRolRolDialog:false,
        // 权限列表
        permissionListRol:[],
        //编辑权限用数据
        editUserRolForm:{
         // 角色描述
          roleName:'',
          //角色名称
          roleDesc:'',
          roleId:''
        },
        //添加角色用户信息
       userRolForm:{
       roleName:'',
       roleDesc:'',
       },
        //添加角色用户表单验证
        userRolRule:{
          roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 3, max:6, message: '长度在 3 到 6个字符', trigger: 'blur' }
          ],
          roleDesc:[
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max:12, message: '长度在 3 到 12个字符', trigger: 'blur' }
          ]
        },
        //编辑角色用户表单验证
        editUserRolRule:{
          roleDesc:[
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max:12, message: '长度在 3 到 12个字符', trigger: 'blur' }
          ]
        }

      }
    },
    created() {
      this.getUserListRol()
    },
    methods:{
      //打开用户添加窗口
      getUserListRol(){
        request({
          url:'roles'
        }).then(res=>{
          this.userListRol=res.data.data
        }).catch(err=>{
          this.$message.error('获取角色列表失败')
        })
      },
      addUserRol(){
        this.userListRolDialog=true
      },
      //取消添加
      addUserRolCancel(){
        //重置表单
        this.$refs.userRolRef.resetFields()
        this.userListRolDialog=false
      },
      //取消编辑
      editUserRolCancel(){
        //重置表单
        this.$refs.editUserRolRef.clearValidate()
        this.editUserRolRolDialog=false
      },
    //  确认添加用户
      userListRolGo(){
        this.$refs.userRolRef.validate(valid=>{
          if(!valid) return
          request({
            url:'roles',
            method: 'post',
            data:this.userRolForm
          }).then(res=> {
            this.$message.success('添加成功')
            this.getUserListRol()
            this.userListRolDialog=false
            this.userRolForm={}
          })
        })
      },
    //  编辑用户editUserRol
      editUserRol(id){
        this.editUserRolRolDialog=true
        //获取权限用户数据
        request({
          url:'roles/'+id,
          method: 'get'
        }).then(res=>{
          this.editUserRolForm=res.data.data
          // console.log(res.data.data)
        })
      },
      //确认编辑
      editUserListRolGo(id){
        // console.log(id)
        this.$refs.editUserRolRef.validate(valid=>{
          if(!valid) return
          request({
            url:'roles/'+id,
            method:'put',
            data:this.editUserRolForm
          }).then(res=>{
            this.$message.success('更新成功')
            this.getUserListRol()
            this.editUserRolRolDialog=false
          }).catch(err=>{
            this.$message.error('更新失败，请重试')
          })
        })
      },
    //  删除权限用户
      async delUserRol(user){
        const confirm=await this.$confirm(`此操作将永久删除${user.roleName}用户, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //取消res为cancel，确定res为confirm
        if(confirm=='cancel') return this.$message.error('已取消删除')
        request({
          url:'roles/'+user.id,
          method:'delete'
        }).then(()=>{
          this.$message.success('删除成功')
          this.getUserListRol()
        })
      },
      // 分配权限按钮
      assignPermissionsRol(role){
        this.roleId=role.id
        //递归获取三级节点id
        this.getLeafKeys(role,this.drfKeys)
        this.assignPermissionsDialog=true
        request({
          url:'rights/tree'
        }).then(res=>{
          // console.log(res.data.data)
          this.permissionListRol=res.data.data
          // console.log(this.permissionListRol)
        })
      },
      //移除权限
      async removeRolId(role,user){
        console.log(user)
       const confirm=await this.$confirm(`此操作将永久删除${user.authName}权限, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(role)
        //取消confirms为cancel，确定res为confirm
        if(confirm=='cancel') return this.$message.error('已取消删除')
        request({
          url:`roles/${role.id}/rights/${user.id}`,
          method:'delete'
        }).then(res=>{
          this.$message.success(`删除${user.authName}权限成功`)
          //更新列表权限
          role.children=res.data.data
        })
      },
      // 通过递归的形式获取三级权限下的所有id，并保存到drfKeys中
      getLeafKeys(node,arr){
//node判断是否为三级节点，arr保存所有三级节点
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item=> {
          this.getLeafKeys(item,arr)
        })
      },
      //监听权限管理对话框的关闭
      assignPermissionsClose(){
          this.drfKeys=[]
      },
      //点击确定为角色分配权限
      allotRights(){
        const keys=[ ...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedNodes()]
        //getCheckedKeys获取所有已选中节点的id数组...展开运算符,getHalfCheckedNodes则返回目前半选中的节点所组成的数组
        // console.log(keys)
        // 用逗号分开，
        const idStr=keys.join(',')
        request({
          url:`roles/${this.roleId}/rights`,
          method:'post',
          data:{
            rids:idStr
          }
        }).then(res=>{
          this.$message.success('权限分配成功')
          this.getUserListRol()
          this.assignPermissionsDialog = false
        }).catch(err=>{
          this.$message.error('权限分配失败')
        })
      }
    }

  }
</script>

<style lang="less" scoped>
.el-tag{
  margin: 15px 0 0 15px;
}
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
</style>
