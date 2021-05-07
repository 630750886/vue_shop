<template>
  <div class="login">
    <div class="content_login">
<!--      t头像-->
      <div class="nav_img"><img src="./logo.png" alt=""></div>
<!--      登录表达-->
      <el-form ref="logForm" :model="logFrom" :rules="rules" class="formLogin">
        <el-form-item prop="username">
          <el-input
              v-model="logFrom.username"
              prefix-icon="iconfont icon-user_name"
              placeholder="请选输入登录账号"
              maxlength="12"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              prefix-icon="iconfont icon-password"
              v-model="logFrom.password"
              placeholder="请选输入登录密码"
              maxlength="15"
              show-password />
        </el-form-item>
        <el-form-item class="btnItem">
          <el-button type="primary" @click="goLogin">登录</el-button>
          <el-button type="info" @click="resetLogFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  //向外默认暴露一个对象
  export default {//组件里面data必须写函数，而且要有返回值return
    data(){
      return {
        logFrom: {
          username:'admin',
          password:'123456'
        },
        rules:{
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在6到 15 个字符', trigger: 'blur' }
          ],
        }

      }
    },
    components:{

    },
    methods:{
      goLogin(){
        //对整个表单进行校验通过valid为true
        this.$refs.logForm.validate(valid=>{
          if(!valid) return;
          request({
            url:'login',
            method:'post',
            data:this.logFrom
          }).then(res=>{
            //判断是否登录成功
            if(res.data.meta.status!==200){
              this.$message.error(res.data.meta.msg,);
            }else {
              const result=res.data
              // 登录成功保存session
              window.sessionStorage.setItem('token',result.data.token)
              //跳转页面
              this.$router.push('/home')
            }
          })

        })
      },
      resetLogFrom(){
        // 重置
        this.$refs.logForm.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>
  .login{
    background-color:#264A6B;
    height: 100%;
    .content_login{
      width: 580px;
      height: 400px;
      background-color: white;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      .nav_img{
        width:150px;
        height:150px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        padding: 10px;
        transform: translate(-50%,-50%);
        background-color:white;
        box-shadow: 0 0 10px darkgrey;
        img{
          width: 150px;
          border-radius: 50%;
        }
      }
    }
  }
  .formLogin{
    margin-top: 130px;
    padding: 20px;
    .btnItem{
      display: flex;
      justify-content: flex-end;
    }
  }

</style>
