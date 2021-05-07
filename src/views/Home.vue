<template>
  <el-container>
    <el-header>
      <div class="head-logo">
        <img src="../assets/logo-head.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isSollapse?'64px' :'200px'">
        <div class="cssSollapse" @click="toggleSollapse">|||</div>
        <el-menu
          default-active="2"
          background-color="#363642"
          text-color="#fff"
          active-text-color="#589DF6"
          :collapse-transition="false"
          :unique-opened="true"
          :collapse="isSollapse" :router="true" :default-active="activePath">
          <el-submenu v-for="item in menusObj" :key="item.id" :index="item.id+''">
<!--          一级导航-->
            <template slot="title">
              <i :class="itemIcon[item.id+'']"></i>
              <span>{{item.authName}}</span>
            </template>
  <!--          二级导航-->
            <el-menu-item @click="saveNavState('/'+itemmenu.path+'')" v-for="itemmenu in item.children" :key="itemmenu.id" :index="'/'+itemmenu.path+''">
              <i class="el-icon-menu"></i>
              <span>{{itemmenu.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>


      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src

import {request} from "../network/request";

export default {
  name: 'Home',
  components: {

  },
  data(){
    return {
      menusObj:[],
      isSollapse:false,
      itemIcon:{
        '125':'iconfont icon-yonghu',
        '103':'iconfont icon-component-full',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-dingdan',
        '145':'iconfont icon-shuju',
      }

    }
  },
  methods:{
    loginOut(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleSollapse(){
      this.isSollapse=!this.isSollapse
    },
    saveNavState(activePath){
      // 吧当前激活状态路由保存到session中
        window.sessionStorage.setItem('activePath',activePath)
    }
  },
  created() {
    request({
      url:'menus',
      activePath:''

    }).then(res=>{
      this.menusObj=res.data.data
    })
    // 组件创建是给activePath赋值，当前激活状态路由
    this.activePath=window.sessionStorage.getItem('activePath')

  }
}
</script>
<style lang="less" scoped>
  .el-container{
    height: 100%;
  }
  .el-header{
    background-color:#3A3B3F ;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img{
      height: 60px;
      margin-right: 10px;
    }
    span{
      color:white;
      font-size: 24px;
    }
  }
  .el-aside{
    background-color: #363642;
  }
  .el-main{
    background-color:#EBECF1 ;
  }
  .head-logo{
    display: flex;
    align-items: center;
  }
  .el-menu{
    border-right: none;
  }
  .cssSollapse{
    background-color: #4A4F63;
    font-size: 10px;
    color: white;
    text-align: center;
    letter-spacing: .3rem;
    cursor: pointer;
    padding:2px 0 5px 0 ;
  }
  .iconfont{
    margin-right: 10px;
  }
</style>
