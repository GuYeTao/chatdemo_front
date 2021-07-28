<template>
  <div class="chatbox">
    <el-col :span="12" :offset="6">
      <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <p>用户端</p>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="chatWindow">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <div class="message" ref="message">
              <div ref="pushmessage" v-for="(item,index) in messageList" :key="item.time">
                <div v-if="item.chatWho==1" style="float: right; width:300px; height:80px">
                  <div :id="'chatmsg'+index" @contextmenu.prevent="rightMessageClick(item.id, item.userId, index)">
                    <div style="font-size: 5px;float: right; color:rgb(103, 194, 58)">{{ new Date(item.time).toLocaleTimeString()}} 我</div><br>
                    <el-tag type="success" style="float: right">{{ item.message }}</el-tag>
                  </div>
                  <div :id="'displayornot'+index" style="display: none;float: right; width:300px; color:rgb(103, 194, 58)">
                    <div id="backMsg" style="position: relative;z-index: 99; float: right;">
                    <span  id="delMsg" style="font-size: 5px;padding: 0;cursor:pointer ;" @click="delMsg(item.id, index)">删除</span>
                    <span  id="withdrawMessage" style="font-size: 5px;padding: 0;cursor:pointer ;margin: auto 2px" @click="withdrawMessage(item.id, index)">撤回</span>
                    <span  id="cancelBack" style="font-size: 5px;padding: 0;cursor:pointer ;" @click="cancelBack(index)">取消</span>
                  </div>
                  </div>
                </div>
                <br />
                <div v-if="item.chatWho==0" style="float: left; width:300px; height:80px">
                    <div style="font-size: 5px;float: left; color:rgb(64, 158, 255)">
                      商家：{{ new Date(item.time).toLocaleTimeString()}}
                    </div><br>
                    <el-tag style="float: left">
                      {{ item.message }}
                    </el-tag>
                </div>
                <br />
                <el-tag v-if="item.chatWho==-1" type="info" style="float: center">
                  系统：{{ item.message }}
                </el-tag>
                <br />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-row :gutter="20">
          <el-col :span="8" :offset="6">
            <el-input placeholder="请输入要发送的消息" prefix-icon="el-icon-s-promotion" v-model="sendMessage" style="width: 100%"></el-input>
          </el-col>
          <el-col :span="5">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="8"><el-button type="primary" @click="handleSendButton()"  icon="el-icon-s-promotion"></el-button></el-col>
              <el-col :span="8"><el-button type="primary" @click="drawer = true" icon="el-icon-time"></el-button></el-col>
              <el-col :span="8"><el-button type="primary" @click="handleLogoutButton()" icon="el-icon-switch-button"></el-button></el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    
    <el-drawer title="历史记录" :visible.sync="drawer" :with-header="false">
      <el-input type="text" placeholder="请输入要搜索的消息" v-model="findMessage" style="width: 50%"></el-input>
      <el-button type="primary" @click="handleViewHistoryButton()" icon="el-icon-search"></el-button><br>
      <div class="block">
        <el-pagination background
          layout="sizes, prev, pager, next, jumper"
          :page-size="page.rn" :page-sizes="[50,100]"
          :total="page.total" @size-change="changePageSize" @current-change="changeCurrPage">
        </el-pagination>
      </div>
        <table>
          <div v-for="item in chats" :key="item.chatTime">
            <div v-if="item.chatWho==1 && item.del!=1" style="float: right; width:500px; height:80px">
                <div style="font-size: 5px;float: right; color:rgb(103, 194, 58)">
                    用户：{{ new Date(item.chatTime).toLocaleTimeString()}}
                </div><br>
                <el-tag style="float: right" type="success">
                  {{ item.chatMsg }}
                </el-tag>
            </div>
            <div v-if="item.chatWho==0" style="float: left; width:500px; height:80px">
                <div style="font-size: 5px;float: left; color:rgb(64, 158, 255)">
                    商家：{{ new Date(item.chatTime).toLocaleTimeString()}}
                </div><br>
                <el-tag style="float: left">
                  {{ item.chatMsg }}
                </el-tag>
            </div>
          </div>
        </table>
    </el-drawer>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 对话
      webSocketObject: null,
      userId: "",
      messageList: [],
      sendMessage: "",
      findMessage:"",
      merchantId:null,

      // 存数据库
      addChatForm: {
        // chatId: null,
        userId: null,
        merchantId: null,
        chatTime: null,
        chatMsg: null,
        chatWho: null,
        del:null,
      },
      chatId: 0,
      // 查看历史
      chats: [],
      page: {
        total: 0,
        pn: 1,
        rn: 10,
      },
      drawer: false,
      // 撤回
      withdrawMessageSmgId: null,
    };
  },
  created() {
    //从localStorage中获得userId
    this.userId = localStorage.getItem("websocket_userId");
    //如果userId不存在返回到登录页面
    if (!this.userId) {
      this.$router.push({
        name: "Login",
      });
    }
    //初始化WebSocket
    this.webSocketInit();
    this.handleViewHistoryButton();
    this.enterSearch();
    this.changePageSize();
    this.changeCurrPage();
  },
  beforeDestroy() {
    this.webSocketObject.close(); //在该组件销毁时关闭该连接以节约资源
  },
  methods: {
    webSocketInit() {
      console.log(this.userId);
      const webSocketUrl = "ws://localhost:8088/websocket/1/" + this.userId;
      this.webSocketObject = new WebSocket(webSocketUrl);
      this.webSocketObject.onopen = this.webSocketOnOpen;
      this.webSocketObject.onmessage = this.webSocketOnMessage;
      this.webSocketObject.onerror = this.webSocketOnError;
      this.webSocketObject.onclose = this.webSocketOnClose;
    },
    webSocketOnOpen(e) {
      console.log("与服务端连接打开->", e);
    },
    webSocketOnMessage(e) {
      console.log("来自服务端的消息->", e);
      const receiveMessage = JSON.parse(e.data);
      console.log(receiveMessage);
      this.merchantId = receiveMessage.merchantId;
      this.userId = receiveMessage.userId;
      if(receiveMessage.chatWho==-2){
        console.log(receiveMessage);
        let index = this.messageList.findIndex(item=>item.id==receiveMessage.id);
        // console.log(index);
        this.messageList.splice(index,1);
      }else{
        this.messageList.push(receiveMessage);
      }
    },
    webSocketOnError(e) {
      console.log("与服务端连接异常->", e);
    },
    webSocketOnClose(e) {
      console.log("与服务端连接关闭->", e);
    },
    handleSendButton() {
      // 存数据库操作
      // this.addChatForm.chatId = ;
      const temptime = new Date().getTime();
      this.addChatForm.userId = localStorage.getItem("websocket_userId"); //防止用户覆盖,从本地取userId
      // this.addChatForm.merchantId = localStorage.getItem("websocket_merchantId");
      this.addChatForm.merchantId = this.merchantId;
      this.addChatForm.chatTime = new Date(temptime);
      this.addChatForm.chatMsg = this.sendMessage;
      this.addChatForm.chatWho = 1;
      this.addChatForm.del = 0;
      let fd = new FormData();
      for (let prop in this.addChatForm) {
        fd.append(prop, this.addChatForm[prop]);
      }
      this.ajax
        .request({
          url: "http://localhost:8088/chat/add.action",
          data: fd,
          method: "post",
        })
        .then((res) => {
          // console.log(res.data.result.chatId);
          this.chatId = res.data.result.chatId;
          // console.log(this.chatId);

          // 发送操作
          // console.log(this.userId);
          this.webSocketObject.send(
            JSON.stringify({
              id: this.chatId,
              message: this.addChatForm.chatMsg,
              time: temptime,
              userId: this.addChatForm.userId,
              merchantId: this.addChatForm.merchantId,
              chatWho: this.addChatForm.chatWho,
              del:0,
            })
          );
        });

      // 清除本次输入
      this.sendMessage = "";
    },

    // 查看历史
    handleViewHistoryButton() {
      let params = {
        pn: this.page.pn,
        rn: this.page.rn,
        userId: this.userId,
      };
      if (this.findMessage) {
        params.chatMsg = this.findMessage;
      }
      this.ajax
        .request({
          url: "/chat/find.action",
          params,
        })
        .then((res) => {
          if (!res.data.code) {
            this.chats = res.data.result.chats;
            this.page.total = res.data.result.total;
          }
        });
    },
    changePageSize(size) {
      this.page.rn = size;
      this.handleViewHistoryButton();
    },
    changeCurrPage(page) {
      this.page.pn = page;
      this.handleViewHistoryButton();
    },
    // 撤回
    rightMessageClick(chatId, userId, index) {
      console.log("右击事件");
      
      this.withdrawMessageSmgId = chatId; //保存消息id
      if (userId === this.userId) {
        // console.log(chatId);
        document.getElementById(`displayornot${index}`).style.display = "block";
      } else {
        return;
      }
    },
    // 删除函数
    delMsg(chatid, index){
      this.$confirm("是否删除", "提示", {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning",
        }).then(() => {
          this.ajax.request({
              url: "/chat/update.action",
              params: {
                id: chatid,
                del:1,//用户删除del置1
              },
            }).then((res) => {
            if (!res.data.code) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.messageList.splice(index,1);
            } else {
              this.$message({
                message: "删除失败",
                type: "error",
              });
            }
          });
        }).catch(()=>{
          //取消的回调
        });
      document.getElementById(`displayornot${index}`).style.display = "none";
    },
    // 撤回函数
    withdrawMessage(chatid, index) {
      const nowTime = new Date().getTime();
      // 120*1000 两分钟
      if (nowTime - this.addChatForm.chatTime < 10 * 1000) {
        this.$confirm("是否撤回", "提示", {
        confirmButtonText: "确认撤回",
        cancelButtonText: "取消",
        type: "warning",
        }).then(() => {
          this.ajax.request({
              url: "/chat/del.action",
              params: {
                id: chatid,
              },
            }).then((res) => {
            if (!res.data.code) {
              const temptime = new Date().getTime();
              this.webSocketObject.send(
                JSON.stringify({
                  id: chatid,
                  message: "",
                  time: temptime,
                  userId: this.addChatForm.userId,
                  merchantId: this.addChatForm.merchantId,
                  chatWho: -2,
                })
              );
              this.$message({
                message: "撤回成功",
                type: "success",
              });
              // this.messageList.splice(index,1);
            } else {
              this.$message({
                message: "撤回失败",
                type: "error",
              });
            }
          });
        }).catch(()=>{
          //取消的回调
        });
      } else {
        this.$message({
          message: "撤回失败",
          type: "error",
        });
        document.getElementById(`displayornot${index}`).style.display = "none";
      }
    },
    cancelBack(index){
      document.getElementById(`displayornot${index}`).style.display = "none";
    },
    handleLogoutButton() {
      localStorage.removeItem("websocket_userId"); //清除userId然后断开连接
      this.webSocketObject.close();
      this.$router.push({
        name: "Login",
      });
    },
    // 回车发送
    enterSearch(){
        document.onkeydown = e =>{
            if (e.keyCode === 13) {
                this.handleSendButton()
            }
        }
    }
  },
};
</script>

<style>
.chatbox{
  background-color: #fff;
  border: #333;
  width: 100%;
  height: 600px;
}
.chatWindow{
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 500px;
}

</style>
