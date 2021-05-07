<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
<!--      警告条-->
      <el-alert
          title="注意：只允许为三级分类设置相关参数！"
          type="warning"
          show-icon
          :closable="false">
      </el-alert>
<!--      级联选择器-->
      <p>
        选择商品分类：
        <el-cascader
            v-model="paraCascaderkeys"
            :options="paraParentcateList"
            expand-trigger="hover"
            :props="paraProps"
            @change="paraHandleChange" clearable></el-cascader>
      </p>
<!--      参数配置-->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <!--添加动态参数按钮-->
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="onlyClick" :disabled="paraCascaderkeys.length>0?false:true">添加参数</el-button>
            </el-col>
          </el-row>
<!--          动态属性表格-->
          <el-table
              :data="attrList"
              style="width: 100%">
<!--            展开tag标签栏-->
            <el-table-column  type="expand">
              <template slot-scope="scope">
                <el-tag
                    v-for="(tag,inx) in scope.row.attr_vals"
                    :key="inx"
                    closable @close="handleClose(inx,scope.row)">
                  {{tag}}
                </el-tag>
                <!--                可切换Tag标签 @keyup.enter.native键盘抬起触发@blur失去焦点触发-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--                添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column
                prop="attr_name"
                label="参数名称">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary"  icon="el-icon-edit" size="mini" @click="editBtn(scope.row)" circle></el-button>
                <el-button type="danger" @click="delEditBtn(scope.row)"  icon="el-icon-delete" size="mini" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!--添加静态属性按钮-->
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="manyClick" :disabled="paraCascaderkeys.length>0?false:true">添加属性</el-button>
            </el-col>
          </el-row>
          <!--          静态属性表格-->
          <el-table
              :data="attrList"
              style="width: 100%">
<!--            展开栏目-->
            <el-table-column  type="expand">
              <template slot-scope="scope">
              <el-tag
                  v-for="(tag,inx) in scope.row.attr_vals"
                  :key="inx"
                  closable>
                {{tag}}
              </el-tag>
<!--                可切换Tag标签 @keyup.enter.native键盘抬起触发@blur失去焦点触发-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
<!--                添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column
                prop="attr_name"
                label="参数名称">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
<!--                编辑按钮-->
                <el-button type="primary" icon="el-icon-edit" size="min" @click="editBtn(scope.row)" circle></el-button>
<!--                删除按钮-->
                <el-button type="danger" @click="delEditBtn(scope.row)" icon="el-icon-delete" size="min" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
<!--      添加属性按钮显示框-->
      <el-dialog
          :title="`添加${title}`"
          :visible.sync="paraDialog"
          width="30%"
          center @close="cateDialogClose">
        <el-form :model="paraForm" :rules="paraFormRul" ref="paraFormRef" label-width="100px">
          <el-form-item :label="`${title}名`" prop="cat_name">
            <el-input v-model="paraForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="paraDialog = false">取 消</el-button>
          <el-button type="primary" @click="addAttr">确 定</el-button>
        </span>
      </el-dialog>
<!--      修改按钮弹出框-->
      <el-dialog
        :title="`修改${title}`"
        :visible.sync="paraEditDialog"
        width="30%"
        center @close="cateEditDialogClose">
        <el-form :model="paraEditForm" :rules="paraEditFormRul" ref="paraEditFormRef" label-width="100px">
          <el-form-item :label="`新${title}`" prop="attr_name">
            <el-input v-model="paraEditForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="paraEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="editAttr(paraEditForm.attr_id)">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {request} from "../../network/request";

  export default {
    name: "Params",
    created() {
      this.getCateList()
    },
    methods:{
      // 级联选择框值发送变化时
      paraHandleChange(){
        // 判断是否为3级参数
       if(this.paraCascaderkeys.length !==3) {
         this.paraCascaderkeys = []
         this.attrList  =[]
         return
       }
          // console.log(this.cateId);
          this.getAttr()

      },
      //获取数据列表
      getCateList (){
        request({
          url:'categories',
          params:this.paraListPar
        }).then(res=>{
          this.paraParentcateList=res.data.data.result
        })
      },
      //获取属性按钮
      getAttr(){
        request({
          url:`categories/${this.cateId}/attributes`,
          params: {
            sel:this.activeName
          }
        }).then(res=>{
          // console.log(res.data.data);
          res.data.data.forEach(item=>{
            item.attr_vals=item.attr_vals?item.attr_vals.split(" "):[]
            //文本框显示隐藏
            item.inputVisible=false
            //文本框输入的值
            item.inputValue=''
          })
          this.attrList=res.data.data
        })
      },
      // 添加参数
      addAttr(){
      this.$refs.paraFormRef.validate(valid=>{
        if(!valid) return this.$message.error('请输入正确的参数名称')
        // console.log(this.activeName);
        // console.log(this.paraForm.cat_name);
        request({
          url:`categories/${this.cateId}/attributes`,
          method:'post',
          data: {
            attr_sel:this.activeName,
            attr_name:this.paraForm.cat_name,

          }
        }).then(res=>{
          this.$message.success('属性添加成功')
          this.getAttr()
          this.paraDialog = false
        }).catch(err=>{
          this.$message.error('添加属性失败，请重试')
        })
      })
      },
      // 显示添加属性弹窗关闭时
      cateDialogClose(){
        this.$refs.paraFormRef.resetFields()

      },
      //属性切换时触发
      tabClick(){
        this.getAttr()
      },
      // 动态属性按钮
      onlyClick(){
        this.paraDialog=true

      },
    //  静态属性按钮
      manyClick(){
        this.paraDialog=true
      },
    //  修改窗口关闭时
      cateEditDialogClose(){
        this.$refs.paraEditFormRef.resetFields()
      },
    //editAttr确认提交编辑
      editAttr(attr_id){
        this.$refs.paraEditFormRef.validate(valid=>{
          if(!valid) return this.$message.error('请输入正确的属性名')
          request({
            url:`categories/${this.cateId}/attributes/${attr_id}`,
            method: 'put',
            data:this.paraEditForm
          }).then(res=>{
            this.getAttr()
            this.$message.success('属性添加成功')
            this.paraEditDialog = false
          })
        })
      },
      //编辑按钮
      editBtn(user){
        // console.log(user);
        //获取数据
        request({
          url:`categories/${this.cateId}/attributes/${user.attr_id}`
        }).then(res=>{
          // console.log(res.data);
          this.paraEditForm=res.data.data
          // console.log(this.paraEditForm);
        })
        this.paraEditDialog =true
      },
      // 删除按钮
      async delEditBtn(user){
        // console.log(user.attr_name);
        const confirm=await this.$confirm(`此操作将永久删除${user.attr_name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //取消confirm为cancel，确定confirm为confirm
        if(confirm=='cancel') return this.$message.error('已取消删除')
        request({
          url:`categories/${this.cateId}/attributes/${user.attr_id}`,
          method:'delete'

        }).then(res=>{
        }).then(res=>{
          this.$message.success('删除成功')
          this.getAttr()
        })

      },
      //tag失去焦点按住enter按键后触发
      handleInputConfirm(row){
        if(row.inputValue.trim().length===0){
          row.inputValue=''
          //隐藏文本框
          row.inputVisible=false
          return
        }
      // 如果没有return出去，需要做后续处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        row.inputVisible=false
      //  发起请求保存该数据,记得传入row
        this.saveAttrVals(row)

      },
      //保存当前tag数据
      saveAttrVals(row){
        request({
          url:`categories/${this.cateId}/attributes/${row.attr_id}`,
          method:'put',
          data:{
            attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            // 把数组转为字符串并用空格拼接
            attr_vals:row.attr_vals.join(' ')
          }
        }).then(res=>{
          this.$message.success('修改参数项成功')
          this.getAttr()
        }).catch(err=>{
          this.$message.error('修改参数项失败，请重试')
        })
      },
      //点击按钮显示文本输入框
      showInput(row){
        row.inputVisible=true
        this.$nextTick(()=> {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    //  删除对应的tag标签
      handleClose(inx,row){
        row.attr_vals.splice(inx,1)
        //  发起请求保存该数据
        this.saveAttrVals(row)
      }
    },
    data(){
      return {
        //获取到的属性列表
        attrList:[],
        //已选中商品分类
        paraCascaderkeys:'',
        // 数据源
        paraParentcateList:[],
        //配置参数
        paraProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
        },
      //  获取数据参数
        paraListPar:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        // 当前显示界面
        activeName:'many',
        //显示弹窗
        paraDialog:false,
        // 输入规则
        paraFormRul:{
          cat_name: [
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            { min: 2, max: 12, message: '长度在 2 到 12个字符', trigger: 'blur' }
          ],
        },
      //  表单数据
        paraForm:{
          cat_name:''
      },
      //  是否显示修改窗口
        paraEditDialog:false,
      //  修改表单数据
        paraEditForm:{
          attr_name:'',
          attr_sel:'',
          attr_id:''
        },
      //  修改规则
        paraEditFormRul:{
          attr_name: [
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            { min: 2, max: 12, message: '长度在 2 到 12个字符', trigger: 'blur' }
          ],
        }
      }
    },
    computed:{
      title(){
        if(this.activeName==='only') return '静态属性'
        return '动态属性'
      },
      //当前选中的id
      cateId(){
        if(this.paraCascaderkeys.length===3) return this.paraCascaderkeys[2]
        return null
      },
      attr_vals(){
        this.attrList.attr_vals
      }
    }
  }
</script>

<style lang="less" scoped>
.el-tag{
  margin: 5px 15px 5px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
