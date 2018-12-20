// miniprogram/pages/goPage/goPage.js
let wxUtils = require('../../wxUtils/wxUtils.js');
const APP = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ac_id : '',//当前活动id
    ac_Name : '上台讲PPT的顺序',
    needLog: true,//需要授权吗？
    hasShared : true,//是否已经分享过了
    showSharedPic : false,//分享图片弹窗开关
    shenhe: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //审核接口
    this.setData({
      shenhe: APP.shenhe
    });

    // 如果是自己创建的活动，需要分享后才能打开，其他人不用(涉嫌诱导分享，审核阶段)
    if (options.creater && !this.data.shenhe){
      this.setData({
        hasShared : false
      });
    }

    //活动id和name
    let { ac_Name, ac_id } = options;
    this.setData({
      ac_id: ac_id,
      ac_Name: ac_Name
    });
    wx.setNavigationBarTitle({ title: ac_Name });
    //用户是否需要授权
    this.userLogin(); 
    //跳转操作
    wxUtils.getOpenId((openid)=>{
      this.setData({
        openid: openid
      });
      //如果已经参与过了本次活动,直接跳转到结果页
      this.directJump(openid,ac_id,ac_Name);
    });
  },

  directJump(openid, ac_id, ac_Name){
    wxUtils.request('checkUserJoinActive', {openid,aid:ac_id}, (res) => {
      if (res.status == 1 && res.is_join){ 
        wx.navigateTo({
          url: `/pages/result/result?ac_id=${ac_id}&ac_Name=${ac_Name}`,
        })
      }
    },undefined,undefined,'GET')
  },

  userLogin(){
    //判断此用户有没有在缓存留下用户信息
    wxUtils.hasUserInfo((hasUserInfo) => {
      this.setData({
        needLog: hasUserInfo ? false : true
      });
    });
  }, 

  getUserInfo(res) {
    if (res.detail.userInfo) {
      let userInfo = res.detail.userInfo;
      userInfo.openid = this.data.openid;

      wxUtils.saveUserInfo(userInfo, (res) => {
        console.log('存用户信息', res);
        this.setData({
          needLog: false
        });
        this.joinGame();
      });
    } else {
      wx.showToast({
        title: '授权才能使用哦',
        icon: 'loading'
      })
    }
  },

  joinGame(){
    if(this.data.hasShared){
      let userInfo = wxUtils.getUserInfo();
      let data = {
        openid: this.data.openid, 
        nickname: userInfo.nickname, 
        headimgurl: userInfo.imageurl, 
        aid: this.data.ac_id  
      }
      wxUtils.request('joinSort',data, successFuc.bind(this), failFuc.bind(this), complete.bind(this),"GET");
    }else{
      wxUtils.showPopModel();
    }

    function successFuc(res){
      console.log(res);
      let self = this;
      if (res && res.status == 1) {
        //加入房间成功 可能情况1、直接抽签  2、自己抽过签   3、抽签活动已满人 
        wx.navigateTo({
          url: `/pages/result/result?ac_id=${self.data.ac_id}&ac_Name=${self.data.ac_Name}`,
        })
      } else {
        //加入房间异常
        wx.showModal({
          title: res.msg,
          content: `回首页重新发起排序吧`,
          showCancel: false,
          confirmText: '去首页',
          success: (data) => {
            if (data.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
      }
    }

    function failFuc(err){
      let self = this;
      // console.log('抽签请求错误', err)
    }
    function complete(){
      let self = this;
    }
  },

  getShareImage(e){
    // console.log('getImage');
    this.setData({
      hasShared : true,
      showSharedPic : true
    })
  },

  closeComponent(e){
    // console.log('close Component');
    this.setData({
      showSharedPic: false
    })
  },

  backIndex(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    // if(e.from == 'button'){
      this.setData({
        hasShared : true
      })

      return {
        title: `${this.data.ac_Name}:你的顺序是几呢？`,
        path: `pages/goPage/goPage?ac_id=${this.data.ac_id}&ac_Name=${this.data.ac_Name}`
      }
    // }
  }
})