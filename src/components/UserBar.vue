<template>
  <div>
    <el-container>
      <el-header style="background-color:#409eff">
        <!-- 菜单导航 -->
        <el-menu id="menu" mode="horizontal" background-color="#409eff" text-color="#fff" active-text-color="#fff" style="font-size: 50px"  router="true">
          <el-menu-item index="/main">超市主页</el-menu-item>
          <el-menu-item index="/home">联系客服</el-menu-item>
          <el-menu-item>下载app</el-menu-item>
          <el-menu-item>加入我们</el-menu-item>
          <el-menu-item>服务政策</el-menu-item>
          <el-menu-item>使用说明</el-menu-item>

          <!-- 用户选项 -->
          <el-menu-item style="float:right">
            <el-dropdown>
              <span class="el-dropdown-link"><i class="el-icon-user"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled
                  ><div id="user0">
                    <el-avatar
                      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                    ></el-avatar></div
                ></el-dropdown-item>
                <el-dropdown-item disabled>{{userId}}</el-dropdown-item>
                <el-dropdown-item @click.native="pushtoUserOrder()">我的订单</el-dropdown-item>
                <el-dropdown-item @click.native="pushtoUserTransport()">我的运单</el-dropdown-item>
                <el-dropdown-item>账户资料</el-dropdown-item>
                <el-dropdown-item>收货地址</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>

          <el-menu-item style="float:right" index="/usercart">
                <i class="el-icon-shopping-cart-2"></i>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer class="UserBarFooter" style="height:300px">
            <el-row :gutter="20">
                <el-col :span="24" :offset="0">
                    <div class="write">
                        <el-row :gutter="20">
                            <el-col :span="10" :offset="0">
                                <el-row :gutter="20">
                                    <el-col :span="3" :offset="3">
                                        <p class="write0">订单服务</p>
                                        <p class="write1">购买指南</p>
                                        <p class="write1">送货政策</p>
                                    </el-col>
                                    <el-col :span="3" :offset="3">
                                        <p class="write0">服务支持</p>
                                        <p class="write1">自助服务</p>
                                        <p class="write1">维修门店</p>
                                    </el-col>
                                    <el-col :span="3" :offset="3">
                                        <p class="write0">媒体中心</p>
                                        <p class="write1">新闻动态</p>
                                        <p class="write1">官方视频</p>
                                        <p class="write1">图片资源</p>
                                    </el-col>
                                    <el-col :span="3" :offset="3">
                                        <p class="write0">关注我们</p>
                                        <p class="write1">新浪微博</p>
                                        <p class="write1">官方微信</p>
                                        <p class="write1">荣誉奖项</p>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="6" :offset="8">
                                <div class="links">
                                <p class="tel0">100 - 450 - 80000</p>
                                <p class="tel1">周一到周日 9:00 - 18:00<br />(仅收市话费)</p>
                                <el-button type="text">☛在线帮助</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10" :offset="6">
                    <div class="bo">
                        <ul class="bo1 clearfix">
                        <li class="bo10">Copyright © 2021 laoxianghao.com 版权所有</li>
                        <li class="bo11">
                            <a
                            href="https://resource.smartisan.com/docs/smartisan_policy_cn.html"
                            target="_blank"
                            style="color: #a3a3a3"
                            >老相好超市隐私政策</a
                            >
                        </li>
                        <li class="bo11">
                            <a
                            href="https://resource.smartisan.com/docs/smartisan_agreement_cn.html"
                            target="_blank"
                            style="color: #a3a3a3"
                            >老相好超市用户协议</a
                            >
                        </li>
                        <li class="bo11">
                            <a
                            href="https://resource.smartisan.com/docs/smartisan_enterprise_certs_cn.html"
                            target="_blank"
                            style="color: #a3a3a3"
                            >资质证照</a
                            >
                        </li>
                        </ul>

                        <ul class="bo1 clearfix">
                        <li class="bo11">
                            <a
                            href="https://beian.miit.gov.cn/#/Integrated/index"
                            target="_blank"
                            style="color: #a3a3a3"
                            >辽 ICP 备 19048301 号 - 1
                            </a>
                        </li>
                        <li class="bo11">
                            <a
                            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502039854"
                            target="_blank"
                            style="color: #a3a3a3"
                            >辽公网安备 10293845510210号</a
                            >
                        </li>
                        <li class="bo11">
                            <a
                            href="http://scj.shenyang.gov.cn/"
                            target="_blank"
                            style="color: #a3a3a3"
                            >沈食药网食备 20213400</a
                            >
                        </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
    data() {
        return {
            userId:null,
        }
    },
    created(){
        this.userId = localStorage.getItem("websocket_userId");
    },
    methods:{
        pushtoUserOrder(){
            this.$router.replace('/userorder');
        },
        pushtoUserTransport(){
            this.$router.replace('/usertransport');
        }
    }
};
</script>

<style>
*{
    margin: 0px;
    border: 0px;
}
.el-header{
    width: 100%;
}
.UserBarFooter{
    border-top: 1px solid #ccc;
}
.menu{
    width: 100%;
}

.write {
  padding-top: 50px;
  height: 180px;
}


.write0 {
  font-size: 12px;
  font-weight: bold;
  color: #5e5e5e;
  margin-bottom: 25px;
}

.write1 {
  font-size: 12px;
  color: #a3a3a3;
  margin-bottom: 10px;
}

.links {
  float: right;
  margin-right: 150px;
  text-align: right;
}

.tel0 {
  position: relative;
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  cursor: default;
  color: #5079d9;
}

.tel1 {
  font-size: 12px;
  color: #999;
}

.bo {
  width: 100%;
  margin-left: 145px;
  margin-right: 150px;
  text-align: left;
  padding-top: 16px;
  font-size: 12px;
  color: #a3a3a3;
  letter-spacing: 1px;
}

.bo1 {
  margin-left: 0px;
  padding-left: 0px;
}

.bo10 {
  padding-left: 0;
  padding-left: 4px;
  border-left: none;
  list-style: none;
  float: left;
  color: #bdbdbd;
}

.bo11 {
  float: left;
  color: #bdbdbd;
  margin: 0 6px;
  padding-left: 8px;
  border-left: 1px solid #ccc;
  list-style: none;
  float: left;
  color: #bdbdbd;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

#user0 {
  padding-left: 20px;
}

</style>