<template>
  <div class="big-box-login">
    <div class="container">
      <div class="form-box">
        <div class="register-box hidden">
          <h1 class="login_h1">register</h1>
          <input
            v-model="register.userName"
            type="text"
            placeholder="Username"
          >
          <input v-model="register.email" type="text" placeholder="Email">
          <input
            v-model="register.passWord"
            type="password"
            placeholder="Password"
          >
          <input
            v-model="register.rePassword"
            type="password"
            placeholder="Password"
          >
          <button @click="doRegister">Register</button>
        </div>
        <div class="login-box">
          <h1 class="login_h1">login</h1>
          <input v-model="loginInfo.email" type="text" placeholder="email">
          <input
            v-model="loginInfo.passWord"
            type="password"
            placeholder="Password"
          >
          <button @click="doLogin">Login</button>
          <div style="margin-top: 16px;">
            <el-radio-group v-model="loginType">
              <el-radio :label="'user'">用户登录</el-radio>
              <el-radio :label="'admin'">管理员</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="con-box left">
        <h2>这里是<span>渲染工具箱</span></h2>
        <p>快来看看好用的<span>工具</span>吧</p>
        <img src="../../assets/images/login_01.png" alt="">
        <p>已有账号</p>
        <button id="login" @click="toLogin">去登录</button>
      </div>
      <div class="con-box right">
        <h2>这里是<span>渲染工具箱</span></h2>
        <p>快来使用好用的<span>工具</span>吧</p>
        <img src="../../assets/images/login_02.png" alt="">
        <p>没有账号？</p>
        <div>
          <button id="register" @click="toRes">去注册</button>
          <button class="activation-btn" @click="activation">激活账号</button>
        </div>
      </div>
    </div>
    <div class="about-dev">
      <p @click="toDev">关于开发者</p>
    </div>
  </div>
</template>

<script>
import { setInfo } from '@/utils/auth'
export default {
  data: () => ({
    loginInfo: {
      email: '',
      passWord: ''
    },
    register: {
      userName: '',
      email: '',
      passWord: '',
      rePassword: ''
    },
    loginType: 'user'
  }),
  mounted() {},
  methods: {
    activation() {
      this.$router.push({ name: 'Activation' })
    },
    toDev() {
      this.$router.push({ name: 'Dep' })
    },
    async doLogin() {
      const Username = this.loginInfo.email
      const Password = this.loginInfo.passWord
      console.log(Username, Password)
      if (!Username || !Password) {
        this.$message({
          message: '请先输入完整用户名和密码哦~',
          type: 'warning'
        })
        return
      }
      let res
      if (this.loginType === 'user') {
        res = await this.$store.dispatch('user/doLogin', this.loginInfo)
      } else {
        console.log('admin 登录')
        res = await this.$store.dispatch('user/adminLogin', this.loginInfo)
      }
      if (res && res.code === 201) {
        // const TOKEN = res.results.token;
        // setToken(TOKEN);
        this.$message({
          message: res.message,
          type: 'success'
        })
        setInfo(res.results.info)
        this.$router.push('/')
        // console.log(res);
      }
    },
    // event doRegister
    async doRegister() {
      if (
        !Object.keys(this.register).filter((v) => !this.register[v]).length <= 0
      ) {
        this.$message({
          message: '请先输入完整的信息哦~',
          type: 'warning'
        })
        return
      }
      if (this.register.passWord !== this.register.rePassword) {
        this.$message({
          message: '两次输入的密码不一样哦！请检查~',
          type: 'warning'
        })
        return
      }
      const regEmail =
        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (this.register.email !== '' && !regEmail.test(this.register.email)) {
        this.$message({
          message: '请输入正确的邮箱格式哦~',
          type: 'warning'
        })
        return
      }
      const res = await this.$store.dispatch('user/doRegister', this.register)
      if (res && res.code === 200) {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.loginInfo.email = this.register.email
        this.loginInfo.passWord = this.register.passWord
        this.toLogin()
      }
    },

    async doTest() {
      const Username = this.loginInfo.email
      const Password = this.loginInfo.passWord
      if (!Username || !Password) {
        this.$message({
          message: '请先输入完整用户名和密码哦~',
          type: 'warning'
        })
        return
      }
      const res = await this.$store.dispatch('user/doTest', {
        Username,
        Password
      })
      console.log(res)
    },
    // event 转换卡片动画
    toRes() {
      const form_box = document.getElementsByClassName('form-box')[0]
      const login_box = document.getElementsByClassName('login-box')[0]
      const register_box = document.getElementsByClassName('register-box')[0]
      form_box.style.transform = 'translateX(80%)'
      login_box.classList.add('hidden')
      register_box.classList.remove('hidden')
    },
    toLogin() {
      const form_box = document.getElementsByClassName('form-box')[0]
      const login_box = document.getElementsByClassName('login-box')[0]
      const register_box = document.getElementsByClassName('register-box')[0]

      form_box.style.transform = 'translateX(0%)'
      register_box.classList.add('hidden')
      login_box.classList.remove('hidden')
    }
  }
}
</script>

<style scoped>
@import url("../../assets/CSS/login.css");
.about-dev {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  cursor: pointer;
  color: #93b720;
}

.activation-btn {
  margin-left: 20px;
}
.footer {
  position: absolute;
  bottom: 0;
}
</style>
