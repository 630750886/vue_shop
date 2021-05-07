<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片区-->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon :closable="false"></el-alert>
      <!--    步骤条-->
      <el-steps :active="activeNum-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="goodsForm" :rules="goodsFormRul" ref="goodsFormRef" label-width="100px"  label-position="top">
        <el-tabs v-model="activeNum" tab-position="left" :before-leave="beforeLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!--      级联选择器-->
            <el-form-item label="商品分类(只能选择三级分类)">
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item,inx) in manyData" :key="inx">
              {{item.attr_name}}
              <el-checkbox-group v-model="item.attr_vals" >
                <el-checkbox :label="item1" v-for="(item1,i1) in item.attr_vals" :key="i1" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,inx) in onlyData" :key="inx">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
<!--            action图片上传地址 handlePreview图片预览窗口 handleRemove删除事件list-type文本框类型 on-success上传成功-->
            <el-upload
              class="upload-demo"
              action="http://www.ysqorz.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture" :headers="headersObj" :on-success="imgSuccess" >
              <el-button size="small" type="primary">点击上传</el-button>
<!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="goodsForm.goods_introduce"/>
            <el-row class="addBtn">
              <el-col :span="24">
                <el-button type="primary" @click="addGoods">添加商品</el-button>
              </el-col>
            </el-row>

          </el-tab-pane>
        </el-tabs>
      </el-form>
<!--      图片显示对话框-->
      <el-dialog
        title="预览"
        :visible.sync="uploadDialog"
        width="50%"
        :before-close="uploadHandleClose">
        <img :src="Preview" alt="" style="width: 100%">
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
  import _ from 'lodash'
  import {request} from "../../network/request";

  export default {
    name: "Reports",
    data (){
      return {
        activeNum:'0',
        // 添加商品信息
        goodsForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          // 级联选择器值
          goods_cat:[],
          //图片数组
          pics:[],
        //  商品介绍
          goods_introduce:'',
          //many和only数组
          attrs:[]
        },
      //  商品分类列表
        cateList:[],
        cateProps:{
          expandTrigger: 'hover',
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
      //  规则
        goodsFormRul:{
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 2, max: 12, message: '长度在 2 到 12个字符', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { min: 1, message: '价格必须填写', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            { min: 1, message: '商品重量必须填写', trigger: 'blur' }


          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            { min: 1, message: '商品数量必须填写', trigger: 'blur' }
          ],
        },
      //  动态属性数据
        manyData:[],
      //  静态属性数据
        onlyData:[],
        //  上传照片请求头参数
        headersObj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        fileList:[],
        // 图片显示
        Preview:'',
        //是否显示放大图片
        uploadDialog:false,
      //  b编辑框内容
        quillContent:'',
      }
    },
    created() {
      this. getCategory()
    },
    methods:{
      // 级联选择框值发送变化时
      handleChange(){
        if(this.goodsForm.goods_cat.length !== 3) return this.goods_cat=[]
      },
      //获取分类列表
      getCategory(){
        request({
          url:'categories'
        }).then(res=>{
          this.cateList=res.data.data
          // console.log(res.data.data);
        })
      },
      //卡片切换时触发
      beforeLeave(activeName, oldActiveName){
        // console.log('即将进入的标签页'+activeName);
        // console.log('即将离开的标签页'+oldActiveName);
        // return false
        if(oldActiveName==='0' && this.goodsForm.goods_cat.length !==3 ){
          this.$message.error('请选择商品分类')
          return false
        }

      },
    //  获取三级分类动态属性
      getManyData(){

      },
    //  tabs切换时触发
      tabClick(){
        if(this.activeNum=='1'){
          request({
            url:`categories/${this.cateId}/attributes`,
            params:{
              sel:'many'
            }
          }).then(res=>{
            // console.log(res.data.data);
            res.data.data.forEach(item=>{
              item.attr_vals=item.attr_vals?item.attr_vals.split(' ') : []
            })
            this.manyData=res.data.data
          })

        }
        else if(this.activeNum=='2'){
          request({
            url:`categories/${this.cateId}/attributes`,
            params:{
              sel:'only'
            }
          }).then(res=>{
            // console.log(res.data.data);
            this.onlyData=res.data.data
          })
        }

      },
    //  图片上传成功
      imgSuccess(res){
        console.log(res);
      //  1、拼接图片信息
        const picInfo={
          pic:res.data.tmp_path
        }
      //  2、将图片push到pics数组中
        this.goodsForm.pics.push(picInfo)
      },
      //移除图片
      handleRemove(file){
        // console.log(file);
      //  获取图片临时路井
        const filePath=file.response.data.tmp_path
      //  从数组中找到索引 x为输入名每一项
        const i=this.goodsForm.pics.findIndex(x => {
          x.pic===filePath
        })
      //  调用splice移除
        this.goodsForm.pics.splice(i,1)
        console.log(this.goodsForm);
      },
      //显示图片
      handlePreview(file){
        this.Preview='http://www.ysqorz.top:8888/'+file.response.data.tmp_path
        // console.log(this.Preview);
        this.uploadDialog=true
      },
    //  点击图片预览关闭按钮触发
      uploadHandleClose(){
        this.uploadDialog=false
      },
    //  确认添加商品
      addGoods(){
        this.$refs.goodsFormRef.validate(valid=>{
          if(!valid) return this.$message.error('请填写表单必要项')
          //执行业务逻辑
          //lodash cloneDeep(Obj)深拷贝对象npm i --save lodash安装依赖
          const form=_.cloneDeep(this.goodsForm)
          form.goods_cat=form.goods_cat.join(',')
          //处理动态属性
          this.manyData.forEach(item=>{
            const newInfo={
              attr_id:item.attr_id,
              //.join(' ')把数组用空格连接成字符串
              attr_value:item.attr_vals.join(' '),
            }
            this.goodsForm.attrs.push(newInfo)
          })
          //处理静态属性
          this.onlyData.forEach(item=>{
            const newInfo={
              attr_id:item.attr_id,
              attr_value:item.attr_vals,
            }
            this.goodsForm.attrs.push(newInfo)
          })
          form.attrs=this.goodsForm.attrs
          console.log(form);
          request({
            url:'goods',
            method:'post',
            data:form
          }).then(res=>{
            console.log(res.data);
            this.$message.success('添加成功')
            this.$router.push('/goods')
          })
        })
      },

    },
    computed:{
      //当前选中的三级分类id
      cateId(){
        if(this.goodsForm.goods_cat.length===3) return this.goodsForm.goods_cat[2]
        return null
      },
    }
  }
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.addBtn{
  margin: 15px 0;
}
</style>
