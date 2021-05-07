import axios from 'axios'
export  function request(config) {
    //创建实例
    const instance = axios.create({
      // baseURL:'http://timemeetyou.com:8889/api/private/v1/',
      baseURL:'http://www.ysqorz.top:8888/api/private/v1/',
      timeout:5000
    })
  //请求拦截
  instance.interceptors.request.use(config=>{
    config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
  })
    //发送请求
    return instance(config)
}
