<template>
  <div>
    <input type="text" v-model="loginForm.userId" placeholder="请输入用户名" />
    <button @click="UserLoginButton()">登录</button>
    <input type="text" v-model="loginForm.merchantId" placeholder="请输入商家用户名" />
    <button @click="MerchantLoginButton()">商家登录</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userId: "",
        merchantId:"",
      },
    };
  },
  methods: {
    // handleLoginButton() {
    //   const userId = this.loginForm.userId.trim();
    //   //验证用户名
    //   if (userId.length < 0) {
    //     alert("请输入正确的用户编号");
    //     return;
    //   }
    //   //将用户名存入localStorage
    //   localStorage.setItem("websocket_userId", userId);
    //   if(userId==0){
    //     this.$store.state.authorization = 0;
    //   }else{
    //     this.$store.state.authorization = 1;
    //   }
    //   //路由跳转
    //   if (this.$store.state.authorization == 0) {
    //     this.$router.push({
    //       name: "AdminHome",
    //     });
    //   } else {
    //     this.$router.push({
    //       name: "Home",//暂时
    //     });
    //   }
    // },
    UserLoginButton(){
      const userId = this.loginForm.userId.trim();
      //验证用户名
      if (userId.length < 0) {
        alert("请输入正确的用户编号");
        return;
      }
      //将用户名存入localStorage
      localStorage.setItem("websocket_userId", userId);
      localStorage.setItem("authorization",1);
      this.$router.push({
          name: "Home",//暂时
        });
    },
    MerchantLoginButton(){
      const merchantId = this.loginForm.merchantId.trim();
      //验证用户名
      if (merchantId.length < 0) {
        alert("请输入正确的用户编号");
        return;
      }
      //将用户名存入localStorage
      localStorage.setItem("websocket_merchantId", merchantId);
      localStorage.setItem("authorization",0);
      this.$router.push({
          name: "AdminHome",
        });
    },
  },
};
</script>

<style>
</style>
